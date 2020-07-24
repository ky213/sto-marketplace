package swiss.alpinetech.exchange.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.apache.commons.collections4.IteratorUtils;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.RestTemplate;
import swiss.alpinetech.exchange.config.Constants;
import swiss.alpinetech.exchange.domain.Authority;
import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.domain.User;
import swiss.alpinetech.exchange.domain.UserSetting;
import swiss.alpinetech.exchange.repository.AuthorityRepository;
import swiss.alpinetech.exchange.repository.UserRepository;
import swiss.alpinetech.exchange.repository.WhiteListingRepository;
import swiss.alpinetech.exchange.repository.search.UserSearchRepository;
import swiss.alpinetech.exchange.repository.search.WhiteListingSearchRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.security.SecurityUtils;
import swiss.alpinetech.exchange.service.dto.UserDTO;

import io.github.jhipster.security.RandomUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service class for managing users.
 */
@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserSearchRepository userSearchRepository;

    private final AuthorityRepository authorityRepository;

    private final CacheManager cacheManager;

    RestTemplate restTemplate;

    @Autowired
    private WhiteListingSearchRepository whiteListingSearchRepository;

    @Autowired
    private WhiteListingRepository whiteListingRepository;

    @Autowired
    private SecurityTokenService securityTokenService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserSearchRepository userSearchRepository, AuthorityRepository authorityRepository, CacheManager cacheManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userSearchRepository = userSearchRepository;
        this.authorityRepository = authorityRepository;
        this.cacheManager = cacheManager;
    }

    public Optional<User> activateRegistration(String key) {
        log.debug("Activating user for activation key {}", key);
        return userRepository.findOneByActivationKey(key)
            .map(user -> {
                // activate given user for the registration key.
                user.setActivated(true);
                user.setActivationKey(null);
                userSearchRepository.save(user);
                this.clearUserCaches(user);
                log.debug("Activated user: {}", user);
                return user;
            });
    }

    public Optional<User> completePasswordReset(String newPassword, String key) {
        log.debug("Reset user password for reset key {}", key);
        return userRepository.findOneByResetKey(key)
            .filter(user -> user.getResetDate().isAfter(Instant.now().minusSeconds(86400)))
            .map(user -> {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setResetKey(null);
                user.setResetDate(null);
                this.clearUserCaches(user);
                return user;
            });
    }

    public Optional<User> requestPasswordReset(String mail) {
        return userRepository.findOneByEmailIgnoreCase(mail)
            .filter(User::getActivated)
            .map(user -> {
                user.setResetKey(RandomUtil.generateResetKey());
                user.setResetDate(Instant.now());
                this.clearUserCaches(user);
                return user;
            });
    }

    public User registerUser(UserDTO userDTO, String password) {
        userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {
                throw new UsernameAlreadyUsedException();
            }
        });
        userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).ifPresent(existingUser -> {
            boolean removed = removeNonActivatedUser(existingUser);
            if (!removed) {
                throw new EmailAlreadyUsedException();
            }
        });
        User newUser = new User();
        String encryptedPassword = passwordEncoder.encode(password);
        newUser.setLogin(userDTO.getLogin().toLowerCase());
        // new user gets initially a generated password
        newUser.setPassword(encryptedPassword);
        newUser.setFirstName(userDTO.getFirstName());
        newUser.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            newUser.setEmail(userDTO.getEmail().toLowerCase());
        }
        newUser.setImageUrl(userDTO.getImageUrl());
        newUser.setLangKey(userDTO.getLangKey());
        // new user is not active
        newUser.setActivated(false);
        // new user gets registration key
        newUser.setActivationKey(RandomUtil.generateActivationKey());
        Set<Authority> authorities = new HashSet<>();
        authorityRepository.findById(AuthoritiesConstants.USER).ifPresent(authorities::add);
        newUser.setAuthorities(authorities);
        userRepository.save(newUser);
        userSearchRepository.save(newUser);
        this.clearUserCaches(newUser);
        log.debug("Created Information for User: {}", newUser);
        return newUser;
    }

    private boolean removeNonActivatedUser(User existingUser) {
        if (existingUser.getActivated()) {
             return false;
        }
        userRepository.delete(existingUser);
        userRepository.flush();
        this.clearUserCaches(existingUser);
        return true;
    }

    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin().toLowerCase());
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail().toLowerCase());
        }
        user.setImageUrl(userDTO.getImageUrl());
        if (userDTO.getLangKey() == null) {
            user.setLangKey(Constants.DEFAULT_LANGUAGE); // default language
        } else {
            user.setLangKey(userDTO.getLangKey());
        }
        String encryptedPassword = passwordEncoder.encode(RandomUtil.generatePassword());
        user.setPassword(encryptedPassword);
        user.setResetKey(RandomUtil.generateResetKey());
        user.setResetDate(Instant.now());
        user.setActivated(true);
        if (userDTO.getAuthorities() != null) {
            Set<Authority> authorities = userDTO.getAuthorities().stream()
                .map(authorityRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
            user.setAuthorities(authorities);
        }
        user.setSetting(userDTO.getSetting());
        userRepository.save(user);
        userSearchRepository.save(user);
        this.clearUserCaches(user);
        log.debug("Created Information for User: {}", user);
        return user;
    }

    /**
     * Update basic information (first name, last name, email, language) for the current user.
     *
     * @param firstName first name of user.
     * @param lastName  last name of user.
     * @param email     email id of user.
     * @param langKey   language key.
     * @param imageUrl  image URL of user.
     */
    public void updateUser(String firstName, String lastName, String email, String langKey, String imageUrl) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                user.setFirstName(firstName);
                user.setLastName(lastName);
                if (email != null) {
                    user.setEmail(email.toLowerCase());
                }
                user.setLangKey(langKey);
                user.setImageUrl(imageUrl);
                userSearchRepository.save(user);
                this.clearUserCaches(user);
                log.debug("Changed Information for User: {}", user);
            });
    }

    /**
     * Update all information for a specific user, and return the modified user.
     *
     * @param userDTO user to update.
     * @return updated user.
     */
    public Optional<UserDTO> updateUser(UserDTO userDTO) {
        return Optional.of(userRepository
            .findById(userDTO.getId()))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .map(user -> {
                this.clearUserCaches(user);
                user.setLogin(userDTO.getLogin().toLowerCase());
                user.setFirstName(userDTO.getFirstName());
                user.setLastName(userDTO.getLastName());
                if (userDTO.getEmail() != null) {
                    user.setEmail(userDTO.getEmail().toLowerCase());
                }
                user.setImageUrl(userDTO.getImageUrl());
                user.setActivated(userDTO.isActivated());
                user.setLangKey(userDTO.getLangKey());
                Set<Authority> managedAuthorities = user.getAuthorities();
                managedAuthorities.clear();
                userDTO.getAuthorities().stream()
                    .map(authorityRepository::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .forEach(managedAuthorities::add);
                user.setSetting(userDTO.getSetting());
                userRepository.save(user);
                userSearchRepository.save(user);
                this.clearUserCaches(user);
                log.debug("Changed Information for User: {}", user);
                return user;
            })
            .map(UserDTO::new);
    }

    public void deleteUser(String login) {
        userRepository.findOneByLogin(login).ifPresent(user -> {
            userRepository.delete(user);
            userSearchRepository.delete(user);
            this.clearUserCaches(user);
            log.debug("Deleted User: {}", user);
        });
    }

    public void changePassword(String currentClearTextPassword, String newPassword) {
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(user -> {
                String currentEncryptedPassword = user.getPassword();
                if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                    throw new InvalidPasswordException();
                }
                String encryptedPassword = passwordEncoder.encode(newPassword);
                user.setPassword(encryptedPassword);
                this.clearUserCaches(user);
                log.debug("Changed password for User: {}", user);
            });
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> getAllManagedUsers(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.ADMIN)) {
                return userRepository.findAllByLoginNot(pageable, Constants.ANONYMOUS_USER).map(UserDTO::new);
            }
        }
        List<UserDTO> userList = userRepository.findAllByLoginNot(pageable, Constants.ANONYMOUS_USER)
            .stream()
            .filter(user -> !this.userIsAdmin(user))
            .map(UserDTO::new)
            .collect(Collectors.toList());

        Page<UserDTO> usersPage = new PageImpl<UserDTO>(
            userList,
            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()),
            userList.size());
        return usersPage;
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getForWhiteListingBySTO(Long securityTokenId) {
        log.debug("Request to get all users whitelisted of this token {}", securityTokenId);
        List<UserDTO> usersList = this.whiteListingRepository.findBySecuritytokenId(securityTokenId)
            .stream()
            .map(item -> item.getUser())
            .map(UserDTO::new)
            .collect(Collectors.toList());
        return usersList;
    }

    @Transactional(readOnly = true)
    public List<Object> getUsersWithBalance() {
        log.debug("Request to get all users with balance");
        List<Object> usersList = this.whiteListingRepository.findAllGroupByUserSumAmount();
        return usersList;
    }

    @Transactional(readOnly = true)
    public Integer getUsersWithRoleUser() {
        log.debug("Request to get number of users with role USER");
        Authority authority = new Authority().name("ROLE_USER");
        Integer number = this.userRepository.countUserByAuthoritiesContains(authority);
        return number;
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthoritiesByLogin(String login) {
        return userRepository.findOneWithAuthoritiesByLogin(login);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities(Long id) {
        return userRepository.findOneWithAuthoritiesById(id);
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserWithAuthorities() {
        return SecurityUtils.getCurrentUserLogin().flatMap(userRepository::findOneWithAuthoritiesByLogin);
    }

    /**
     * Not activated users should be automatically deleted after 3 days.
     * <p>
     * This is scheduled to get fired everyday, at 01:00 (am).
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void removeNotActivatedUsers() {
        userRepository
            .findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant.now().minus(3, ChronoUnit.DAYS))
            .forEach(user -> {
                log.debug("Deleting not activated user {}", user.getLogin());
                userRepository.delete(user);
                userSearchRepository.delete(user);
                this.clearUserCaches(user);
            });
    }

    /**
     * Gets a list of all the authorities.
     * @return a list of all the authorities.
     */
    public List<String> getAuthorities() {
        return authorityRepository.findAll().stream().map(Authority::getName).collect(Collectors.toList());
    }


    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE)).evict(user.getLogin());
        if (user.getEmail() != null) {
            Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE)).evict(user.getEmail());
        }
    }

    public Page<UserDTO> search(String query, Pageable pageable) {
        if (this.currentUserIsAdmin()) {
            return userSearchRepository.search(queryStringQuery(query), pageable).map(UserDTO::new);
        }
        List<UserDTO> userList = IteratorUtils.toList(userSearchRepository.search(queryStringQuery(query)).iterator())
            .stream()
            .filter(user -> !this.userIsAdmin(user))
            .map(UserDTO::new)
            .collect(Collectors.toList());
        Page<UserDTO> usersPage = new PageImpl<UserDTO>(
            userList,
            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()),
            userList.size());
        return usersPage;
    }

    public List<UserDTO> standardSearch(String query) {
        if (this.currentUserIsAdmin()) {
            return IteratorUtils.toList(userSearchRepository.search(queryStringQuery(query+"*").field("login")).iterator())
                .stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
        }
        return IteratorUtils.toList(userSearchRepository.search(queryStringQuery(query+"*").field("login")).iterator())
            .stream()
            .filter(user -> !this.userIsAdmin(user))
            .map(UserDTO::new)
            .collect(Collectors.toList());
    }

    public List<UserDTO> searchForWhiteListing(String query, Long securityTokenId) {
        log.debug("Request to search users for query {} for whiteListing autocomplete", query);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (securityTokenId == null)  {
            return this.standardSearch(query);
        }
        SecurityToken securityToken = this.securityTokenService.findOne(securityTokenId).get();
        List<Long> usersPermitted = IteratorUtils.toList(this.whiteListingSearchRepository.search(QueryBuilders.boolQuery()
            .must(matchQuery("securitytoken.id", securityTokenId))).iterator())
            .stream()
            .map(wl -> wl.getUser().getId())
            .collect(Collectors.toList());

        List<UserDTO> usersList = IteratorUtils.toList(userSearchRepository.search(queryStringQuery(query+"*").field("login")).iterator())
            .stream()
            .filter(
                us ->
                        !usersPermitted.contains(us.getId()) &&
                        !securityToken.getRestrictionCounty().equals(us.getSetting().getCountry().name()) &&
                        !securityToken.getRestrictionNationality().equals(us.getSetting().getNationality())
            )
            .map(UserDTO::new)
            .collect(Collectors.toList());

        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.ADMIN)) {
                return usersList;
            }
        }

        return usersList
            .stream()
            .filter(user -> !this.userIsAdmin(user))
            .collect(Collectors.toList());
    }

    public Double getAndUpdateBalanceAccountFromAvaloq(String login) {
        User user = this.userRepository.findOneByLogin(login).get();
        String sandboxHost = "https://api-qwgzy.emea.sandbox.avaloq.com";
        String token = "";
        String accountID = user.getSetting().getIban();
        if (accountID == null || accountID == "") {
            UserSetting userSetting = user.getSetting();
            userSetting.setBalance(0.0);
            user.setSetting(userSetting);
            userRepository.save(user);
            return 0.0;
        }
        String calUrl = sandboxHost + "/account-management/accounts/" + accountID + "?with_balance=true";
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBearerAuth(token);
        HttpEntity request = new HttpEntity(headers);
        String stringReturnObject = this.restTemplate.exchange(calUrl, HttpMethod.GET, request, String.class).getBody();
        if (stringReturnObject == null) {
            return null;
        }
        JsonObject convertedObject = new Gson().fromJson(stringReturnObject, JsonObject.class);
        Double balance = convertedObject
            .get("balance")
            .getAsJsonObject()
            .get("amount")
            .getAsJsonObject()
            .get("value")
            .getAsDouble();
        UserSetting userSetting = user.getSetting();
        userSetting.setBalance(balance);
        user.setSetting(userSetting);
        userRepository.save(user);
        return balance;
    }

    private boolean userIsAdmin(User user) {
        Set<Authority> userAuthorities =  this.getUserWithAuthorities(user.getId()).get().getAuthorities();
        for (Authority userAuthority : userAuthorities) {
            if(userAuthority.getName().equals(AuthoritiesConstants.ADMIN)) {
                return true;
            }
        }
        return false;
    }

    private boolean userIsAdmin(UserDTO user) {
        Set<Authority> userAuthorities =  this.getUserWithAuthorities(user.getId()).get().getAuthorities();
        for (Authority userAuthority : userAuthorities) {
            if(userAuthority.getName().equals(AuthoritiesConstants.ADMIN)) {
                return true;
            }
        }
        return false;
    }

    private boolean currentUserIsAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.ADMIN)) {
                return true;
            }
        }
        return false;
    }
}
