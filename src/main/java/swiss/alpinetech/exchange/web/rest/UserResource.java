package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.config.Constants;
import swiss.alpinetech.exchange.domain.User;
import swiss.alpinetech.exchange.repository.UserRepository;
import swiss.alpinetech.exchange.repository.search.UserSearchRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.MailService;
import swiss.alpinetech.exchange.service.UserService;
import swiss.alpinetech.exchange.service.dto.UserDTO;
import swiss.alpinetech.exchange.web.rest.errors.BadRequestAlertException;
import swiss.alpinetech.exchange.web.rest.errors.EmailAlreadyUsedException;
import swiss.alpinetech.exchange.web.rest.errors.LoginAlreadyUsedException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing users.
 * <p>
 * This class accesses the {@link User} entity, and needs to fetch its collection of authorities.
 * <p>
 * For a normal use-case, it would be better to have an eager relationship between User and Authority,
 * and send everything to the client side: there would be no View Model and DTO, a lot less code, and an outer-join
 * which would be good for performance.
 * <p>
 * We use a View Model and a DTO for 3 reasons:
 * <ul>
 * <li>We want to keep a lazy association between the user and the authorities, because people will
 * quite often do relationships with the user, and we don't want them to get the authorities all
 * the time for nothing (for performance reasons). This is the #1 goal: we should not impact our users'
 * application because of this use-case.</li>
 * <li> Not having an outer join causes n+1 requests to the database. This is not a real issue as
 * we have by default a second-level cache. This means on the first HTTP call we do the n+1 requests,
 * but then all authorities come from the cache, so in fact it's much better than doing an outer join
 * (which will get lots of data from the database, for each HTTP call).</li>
 * <li> As this manages users, for security reasons, we'd rather have a DTO layer.</li>
 * </ul>
 * <p>
 * Another option would be to have a specific JPA entity graph to handle this case.
 */
@RestController
@RequestMapping("/api")
public class UserResource {

    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserService userService;

    private final UserRepository userRepository;

    private final MailService mailService;

    private final UserSearchRepository userSearchRepository;

    public UserResource(UserService userService, UserRepository userRepository, MailService mailService, UserSearchRepository userSearchRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.userSearchRepository = userSearchRepository;
    }

    /**
     * {@code POST  /users}  : Creates a new user.
     * <p>
     * Creates a new user if the login and email are not already used, and sends an
     * mail with an activation link.
     * The user needs to be activated on creation.
     *
     * @param userDTO the user to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new user, or with status {@code 400 (Bad Request)} if the login or email is already in use.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     * @throws BadRequestAlertException {@code 400 (Bad Request)} if the login or email is already in use.
     */
    @PostMapping("/users")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserDTO userDTO) throws URISyntaxException {
        log.debug("REST request to save User : {}", userDTO);

        if (userDTO.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
            // Lowercase the user login before comparing with database
        } else if (userRepository.findOneByLogin(userDTO.getLogin().toLowerCase()).isPresent()) {
            throw new LoginAlreadyUsedException();
        } else if (userRepository.findOneByEmailIgnoreCase(userDTO.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException();
        } else {
            User newUser = userService.createUser(userDTO);
            mailService.sendCreationEmail(newUser);
            return ResponseEntity.created(new URI("/api/users/" + newUser.getLogin()))
                .headers(HeaderUtil.createAlert(applicationName,  "A user is created with identifier " + newUser.getLogin(), newUser.getLogin()))
                .body(newUser);
        }
    }

    /**
     * {@code PUT /users} : Updates an existing User.
     *
     * @param userDTO the user to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated user.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already in use.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already in use.
     */
    @PutMapping("/users")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<UserDTO> updateUser(@Valid @RequestBody UserDTO userDTO) {
        log.debug("REST request to update User : {}", userDTO);
        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(userDTO.getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new EmailAlreadyUsedException();
        }
        existingUser = userRepository.findOneByLogin(userDTO.getLogin().toLowerCase());
        if (existingUser.isPresent() && (!existingUser.get().getId().equals(userDTO.getId()))) {
            throw new LoginAlreadyUsedException();
        }
        Optional<UserDTO> updatedUser = userService.updateUser(userDTO);

        return ResponseUtil.wrapOrNotFound(updatedUser,
            HeaderUtil.createAlert(applicationName, "A user is updated with identifier " + userDTO.getLogin(), userDTO.getLogin()));
    }

    /**
     * {@code GET /users} : get all users.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<List<UserDTO>> getAllUsers(Pageable pageable) {
        log.debug("REST request to get all users");
        final Page<UserDTO> page = userService.getAllManagedUsers(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * {@code GET /users} : get all users whitelisted of sto.
     *
     * @param securityTokenId the sto ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body all users.
     */
    @GetMapping("/users-sto-whitelists")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\", \""+AuthoritiesConstants.USER+"\")")
    public ResponseEntity<List<UserDTO>> getAllUsersForWhiteListing(@RequestParam Long securityTokenId) {
        log.debug("REST request to get all users whitelisted for sto {}",securityTokenId);
        final List<UserDTO> userDTOList = userService.getForWhiteListingBySTO(securityTokenId);
        return ResponseEntity.ok().body(userDTOList);
    }

    /**
     * Gets a list of all roles.
     * @return a string list of all roles.
     */
    @GetMapping("/users/authorities")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\", \""+AuthoritiesConstants.USER+"\")")
    public List<String> getAuthorities() {
        log.debug("REST request to get all authorities");
        return userService.getAuthorities();
    }

    /**
     * Gets top 6 users list with their balance.
     * @return a list object (login, balance)
     */
    @GetMapping("/users/total-balance")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<List<Object>> getUsersWithBalance() {
        log.debug("REST request to get all users with their balances from whitelist");
        List<Object> map = userService.getUsersWithBalance();
        return ResponseEntity.ok().body(map);
    }

    /**
     * Gets number of users with role ROLE_USER.
     * @return integer number
     */
    @GetMapping("/users/number-of-role-user")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<Integer> getUsersNumberWithRoleUser() {
        log.debug("REST request to get count users with role USER");
        Integer number = userService.getUsersWithRoleUser();
        return ResponseEntity.ok().body(number);
    }

    /**
     * Gets user balance from avaloq API
     * @param userLogin
     * @return double number
     */
    @GetMapping("/user/avaloq-balance")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\", \""+AuthoritiesConstants.USER+"\")")
    public ResponseEntity<Double> getUserBalance(@RequestParam String userLogin) {
        log.debug("REST request to get user balance from AVALOQ API");
        Double balance = userService.getAndUpdateBalanceAccountFromAvaloq(userLogin);
        return ResponseEntity.ok().body(balance);
    }

    /**
     * {@code GET /users/:login} : get the "login" user.
     *
     * @param login the login of the user to find.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the "login" user, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/users/{login:" + Constants.LOGIN_REGEX + "}")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\", \""+AuthoritiesConstants.USER+"\")")
    public ResponseEntity<UserDTO> getUser(@PathVariable String login) {
        return ResponseUtil.wrapOrNotFound(
            userService.getUserWithAuthoritiesByLogin(login)
                .map(UserDTO::new));
    }

    /**
     * {@code DELETE /users/:login} : delete the "login" User.
     *
     * @param login the login of the user to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/users/{login:" + Constants.LOGIN_REGEX + "}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteUser(@PathVariable String login) {
        log.debug("REST request to delete User: {}", login);
        userService.deleteUser(login);
        return ResponseEntity.noContent().headers(HeaderUtil.createAlert(applicationName,  "A user is deleted with identifier " + login, login)).build();
    }

    /**
     * {@code SEARCH /_search/users/:query} : search for the User corresponding to the query.
     *
     * @param query the query to search.
     * @return the result of the search.
     */
    @GetMapping("/_search/users/{query}")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<List<UserDTO>> search(@PathVariable String query, Pageable pageable) {
        log.debug("REST request to search for a page of Users for query {}", query);
        Page<UserDTO> page = userService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/_search-autocomplete/users")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<List<UserDTO>> searchPermittedUsers(@RequestParam String query, @RequestParam Long securityTokenId) {
        log.debug("REST request to search users for query {} for whiteListing autocomplete {}", query);
        List<UserDTO> usersList = userService.searchForWhiteListing(query, securityTokenId);
        return ResponseEntity.ok().body(usersList);
    }
}
