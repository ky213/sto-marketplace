package swiss.alpinetech.exchange.repository.search;

import io.github.jhipster.config.JHipsterConstants;
import io.micrometer.core.annotation.Timed;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.ManyToMany;
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Collectors;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.elasticsearch.ResourceAlreadyExistsException;
import com.github.vanroy.springdata.jest.JestElasticsearchTemplate;
import com.fasterxml.jackson.annotation.JsonIgnore;
import swiss.alpinetech.exchange.domain.*;
import swiss.alpinetech.exchange.repository.*;
import swiss.alpinetech.exchange.repository.search.*;

/**
 * Created by azanlekor on 09.06.20.
 * Class for reindexing automatically Elasticsearch
 */
@Service
@Transactional(readOnly = true)
public class ElasticsearchIndexService {



    private static final Lock reindexLock = new ReentrantLock();

    private final Environment env;

    private final Logger log = LoggerFactory.getLogger(ElasticsearchIndexService.class);

    private final BankInfoRepository bankInfoRepository ;

    private final BankInfoSearchRepository bankInfoSearchRepository;

    private final HomeBankRepository homeBankRepository;
    private final HomeBankSearchRepository homeBankSearchRepository;

    private final HomeCustomerRepository homeCustomerRepository;
    private final HomeCustomerSearchRepository homeCustomerSearchRepository;

    private final OrderRepository orderRepository;
    private final OrderSearchRepository orderSearchRepository;

    private final SecurityTokenRepository securityTokenRepository;
    private final SecurityTokenSearchRepository securityTokenSearchRepository;

    private final TransactionRepository transactionRepository;
    private final TransactionSearchRepository transactionSearchRepository;

    private final UserRepository userRepository;
    private final UserSearchRepository userSearchRepository;

    private final UserSettingRepository userSettingRepository;
    private final UserSettingSearchRepository userSettingSearchRepository;

    private final WhiteListingRepository whiteListingRepository;
    private final WhiteListingSearchRepository whiteListingSearchRepository;

    private final ElasticsearchOperations elasticsearchTemplate;

    public ElasticsearchIndexService(Environment env,BankInfoRepository bankInfoRepository, BankInfoSearchRepository bankInfoSearchRepository, HomeBankRepository homeBankRepository, HomeBankSearchRepository homeBankSearchRepository, HomeCustomerRepository homeCustomerRepository, HomeCustomerSearchRepository homeCustomerSearchRepository, OrderRepository orderRepository, OrderSearchRepository orderSearchRepository, SecurityTokenRepository securityTokenRepository, SecurityTokenSearchRepository securityTokenSearchRepository, TransactionRepository transactionRepository, TransactionSearchRepository transactionSearchRepository, UserRepository userRepository, UserSearchRepository userSearchRepository, UserSettingRepository userSettingRepository, UserSettingSearchRepository userSettingSearchRepository, WhiteListingRepository whiteListingRepository, WhiteListingSearchRepository whiteListingSearchRepository, ElasticsearchOperations elasticsearchTemplate) {
        this.bankInfoRepository = bankInfoRepository;
        this.bankInfoSearchRepository = bankInfoSearchRepository;
        this.homeBankRepository = homeBankRepository;
        this.homeBankSearchRepository = homeBankSearchRepository;
        this.homeCustomerRepository = homeCustomerRepository;
        this.homeCustomerSearchRepository = homeCustomerSearchRepository;
        this.orderRepository = orderRepository;
        this.orderSearchRepository = orderSearchRepository;
        this.securityTokenRepository = securityTokenRepository;
        this.securityTokenSearchRepository = securityTokenSearchRepository;
        this.transactionRepository = transactionRepository;
        this.transactionSearchRepository = transactionSearchRepository;
        this.userRepository = userRepository;
        this.userSearchRepository = userSearchRepository;
        this.userSettingRepository = userSettingRepository;
        this.userSettingSearchRepository = userSettingSearchRepository;
        this.whiteListingRepository = whiteListingRepository;
        this.whiteListingSearchRepository = whiteListingSearchRepository;
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.env = env;
    }

    @Async
    @Timed
    @EventListener(ApplicationReadyEvent.class)
    public void reindexAll() {
        if (reindexLock.tryLock()) {
            try {
                if(Arrays.asList(env.getActiveProfiles()).contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT)) {
                    log.info("Elasticsearch: Start performing reindexing ..");
                    reindexForClass(User.class, userRepository, userSearchRepository);
                    reindexForClass(BankInfo.class, bankInfoRepository, bankInfoSearchRepository);
                    reindexForClass(HomeBank.class, homeBankRepository, homeBankSearchRepository);
                    reindexForClass(HomeCustomer.class, homeCustomerRepository, homeCustomerSearchRepository);
                    reindexForClass(Order.class, orderRepository, orderSearchRepository);
                    reindexForClass(SecurityToken.class, securityTokenRepository, securityTokenSearchRepository);
                    reindexForClass(Transaction.class, transactionRepository, transactionSearchRepository);
                    reindexForClass(UserSetting.class, userSettingRepository, userSettingSearchRepository);
                    reindexForClass(WhiteListing.class, whiteListingRepository, whiteListingSearchRepository);
                }

                log.info("Elasticsearch: Successfully performed reindexing");
            } finally {
                reindexLock.unlock();
            }
        } else {
            log.info("Elasticsearch: concurrent reindexing attempt");
        }
    }


    private <T, ID extends Serializable> void reindexForClass(Class<T> entityClass, JpaRepository<T, ID> jpaRepository,

        ElasticsearchRepository<T, ID> elasticsearchRepository) {


        elasticsearchTemplate.putMapping(entityClass);

        if (jpaRepository.count() > 0 ) {

            // if a entity field is the owner side of a many-to-many relationship, it should be loaded manually
            List<Method> relationshipGetters = Arrays.stream(entityClass.getDeclaredFields())
                .filter(field -> field.getType().equals(Set.class))
                .filter(field -> field.getAnnotation(ManyToMany.class) != null)
                .filter(field -> field.getAnnotation(ManyToMany.class).mappedBy().isEmpty())
                .filter(field -> field.getAnnotation(JsonIgnore.class) == null)
                .map(field -> {
                    try {
                        return new PropertyDescriptor(field.getName(), entityClass).getReadMethod();
                    } catch (IntrospectionException e) {
                        log.error("Error retrieving getter for class {}, field {}. Field will NOT be indexed",
                            entityClass.getSimpleName(), field.getName(), e);
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

                log.info("Indexing Entity of size {}", jpaRepository.count());
                List<T> results = jpaRepository.findAll();

            // if there are any relationships to load, do it now
            for (int i = 0 ; i < results.size() ; i++) {
                T entity = results.get(i);
                for (int j = 0 ; j < relationshipGetters.size() ; j++) {
                    Method method = relationshipGetters.get(j);
                    try {
                        // eagerly load the relationship set
                        long t = ((Set) method.invoke(entity)).size();
                    } catch (Exception ex) {
                        log.error(ex.getMessage());
                    }
                }
            }

            elasticsearchRepository.saveAll(results);

        }
        log.info("Elasticsearch: Indexed all rows for {}", entityClass.getSimpleName());
    }

}
