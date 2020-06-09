package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.ExchangeApp;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.repository.OrderRepository;
import swiss.alpinetech.exchange.repository.search.OrderSearchRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.OrderService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static swiss.alpinetech.exchange.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;
import swiss.alpinetech.exchange.domain.enumeration.ORDERTYPE;
import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;
/**
 * Integration tests for the {@link OrderResource} REST controller.
 */
@SpringBootTest(classes = ExchangeApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser(authorities = {AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.BANK})
public class OrderResourceIT {

    private static final String DEFAULT_ID_ORDER = "AAAAAAAAAA";
    private static final String UPDATED_ID_ORDER = "BBBBBBBBBB";

    private static final Long DEFAULT_REF_ORDER = 1L;
    private static final Long UPDATED_REF_ORDER = 2L;

    private static final ZonedDateTime DEFAULT_CREATE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_CLOSE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CLOSE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_SECURITY_TOKEN_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SECURITY_TOKEN_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SYMBOL = "AAAAAAAAAA";
    private static final String UPDATED_SYMBOL = "BBBBBBBBBB";

    private static final ACTIONTYPE DEFAULT_TYPE = ACTIONTYPE.BUY;
    private static final ACTIONTYPE UPDATED_TYPE = ACTIONTYPE.SELL;

    private static final ORDERTYPE DEFAULT_LIMIT_OR_MARKET = ORDERTYPE.LIMIT;
    private static final ORDERTYPE UPDATED_LIMIT_OR_MARKET = ORDERTYPE.MARKET;

    private static final Double DEFAULT_VOLUME = 0D;
    private static final Double UPDATED_VOLUME = 1D;

    private static final Double DEFAULT_PRICE = 0D;
    private static final Double UPDATED_PRICE = 1D;

    private static final Double DEFAULT_TOTAL_AMOUNT = 0D;
    private static final Double UPDATED_TOTAL_AMOUNT = 1D;

    private static final CATEGORY DEFAULT_CATEGORY_TOKEN = CATEGORY.EQUITY;
    private static final CATEGORY UPDATED_CATEGORY_TOKEN = CATEGORY.FUNDS;

    private static final STATUS DEFAULT_STATUS = STATUS.NONE;
    private static final STATUS UPDATED_STATUS = STATUS.INIT;

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    /**
     * This repository is mocked in the swiss.alpinetech.exchange.repository.search test package.
     *
     * @see swiss.alpinetech.exchange.repository.search.OrderSearchRepositoryMockConfiguration
     */
    @Autowired
    private OrderSearchRepository mockOrderSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderMockMvc;

    private Order order;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Order createEntity(EntityManager em) {
        Order order = new Order()
            .idOrder(DEFAULT_ID_ORDER)
            .refOrder(DEFAULT_REF_ORDER)
            .createDate(DEFAULT_CREATE_DATE)
            .updateDate(DEFAULT_UPDATE_DATE)
            .closeDate(DEFAULT_CLOSE_DATE)
            .symbol(DEFAULT_SYMBOL)
            .type(DEFAULT_TYPE)
            .limitOrMarket(DEFAULT_LIMIT_OR_MARKET)
            .volume(DEFAULT_VOLUME)
            .price(DEFAULT_PRICE)
            .totalAmount(DEFAULT_TOTAL_AMOUNT)
            .categoryToken(DEFAULT_CATEGORY_TOKEN)
            .status(DEFAULT_STATUS)
            .active(DEFAULT_ACTIVE);
        return order;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Order createUpdatedEntity(EntityManager em) {
        Order order = new Order()
            .idOrder(UPDATED_ID_ORDER)
            .refOrder(UPDATED_REF_ORDER)
            .createDate(UPDATED_CREATE_DATE)
            .updateDate(UPDATED_UPDATE_DATE)
            .closeDate(UPDATED_CLOSE_DATE)
            .symbol(UPDATED_SYMBOL)
            .type(UPDATED_TYPE)
            .limitOrMarket(UPDATED_LIMIT_OR_MARKET)
            .volume(UPDATED_VOLUME)
            .price(UPDATED_PRICE)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .categoryToken(UPDATED_CATEGORY_TOKEN)
            .status(UPDATED_STATUS)
            .active(UPDATED_ACTIVE);
        return order;
    }

    @BeforeEach
    public void initTest() {
        order = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrder() throws Exception {
        int databaseSizeBeforeCreate = orderRepository.findAll().size();

        // Create the Order
        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isCreated());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeCreate + 1);
        Order testOrder = orderList.get(orderList.size() - 1);
        assertThat(testOrder.getIdOrder()).isEqualTo(DEFAULT_ID_ORDER);
        assertThat(testOrder.getRefOrder()).isEqualTo(DEFAULT_REF_ORDER);
        assertThat(testOrder.getCreateDate()).isEqualTo(DEFAULT_CREATE_DATE);
        assertThat(testOrder.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testOrder.getCloseDate()).isEqualTo(DEFAULT_CLOSE_DATE);
        assertThat(testOrder.getSymbol()).isEqualTo(DEFAULT_SYMBOL);
        assertThat(testOrder.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testOrder.getLimitOrMarket()).isEqualTo(DEFAULT_LIMIT_OR_MARKET);
        assertThat(testOrder.getVolume()).isEqualTo(DEFAULT_VOLUME);
        assertThat(testOrder.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testOrder.getTotalAmount()).isEqualTo(DEFAULT_TOTAL_AMOUNT);
        assertThat(testOrder.getCategoryToken()).isEqualTo(DEFAULT_CATEGORY_TOKEN);
        assertThat(testOrder.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testOrder.isActive()).isEqualTo(DEFAULT_ACTIVE);

        // Validate the Order in Elasticsearch
        verify(mockOrderSearchRepository, times(1)).save(testOrder);
    }

    @Test
    @Transactional
    public void createOrderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orderRepository.findAll().size();

        // Create the Order with an existing ID
        order.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeCreate);

        // Validate the Order in Elasticsearch
        verify(mockOrderSearchRepository, times(0)).save(order);
    }


    @Test
    @Transactional
    public void checkIdOrderIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderRepository.findAll().size();
        // set the field null
        order.setIdOrder(null);

        // Create the Order, which fails.

        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeTest);
    }

//    @Test
//    @Transactional
//    public void checkRefOrderIsRequired() throws Exception {
//        int databaseSizeBeforeTest = orderRepository.findAll().size();
//        // set the field null
//        order.setRefOrder(null);
//
//        // Create the Order, which fails.
//
//        restOrderMockMvc.perform(post("/api/orders")
//            .contentType(MediaType.APPLICATION_JSON)
//            .content(TestUtil.convertObjectToJsonBytes(order)))
//            .andExpect(status().isBadRequest());
//
//        List<Order> orderList = orderRepository.findAll();
//        assertThat(orderList).hasSize(databaseSizeBeforeTest);
//    }

    @Test
    @Transactional
    public void checkSymbolIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderRepository.findAll().size();
        // set the field null
        order.setSymbol(null);

        // Create the Order, which fails.

        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkVolumeIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderRepository.findAll().size();
        // set the field null
        order.setVolume(null);

        // Create the Order, which fails.

        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderRepository.findAll().size();
        // set the field null
        order.setPrice(null);

        // Create the Order, which fails.

        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTotalAmountIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderRepository.findAll().size();
        // set the field null
        order.setTotalAmount(null);

        // Create the Order, which fails.

        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOrders() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        // Get all the orderList
        restOrderMockMvc.perform(get("/api/orders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(order.getId().intValue())))
            .andExpect(jsonPath("$.[*].idOrder").value(hasItem(DEFAULT_ID_ORDER)))
            .andExpect(jsonPath("$.[*].refOrder").value(hasItem(DEFAULT_REF_ORDER.intValue())))
            .andExpect(jsonPath("$.[*].createDate").value(hasItem(sameInstant(DEFAULT_CREATE_DATE))))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(sameInstant(DEFAULT_UPDATE_DATE))))
            .andExpect(jsonPath("$.[*].closeDate").value(hasItem(sameInstant(DEFAULT_CLOSE_DATE))))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].limitOrMarket").value(hasItem(DEFAULT_LIMIT_OR_MARKET.toString())))
            .andExpect(jsonPath("$.[*].volume").value(hasItem(DEFAULT_VOLUME.doubleValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].totalAmount").value(hasItem(DEFAULT_TOTAL_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].categoryToken").value(hasItem(DEFAULT_CATEGORY_TOKEN.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    public void getOrder() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        // Get the order
        restOrderMockMvc.perform(get("/api/orders/{id}", order.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(order.getId().intValue()))
            .andExpect(jsonPath("$.idOrder").value(DEFAULT_ID_ORDER))
            .andExpect(jsonPath("$.refOrder").value(DEFAULT_REF_ORDER.intValue()))
            .andExpect(jsonPath("$.createDate").value(sameInstant(DEFAULT_CREATE_DATE)))
            .andExpect(jsonPath("$.updateDate").value(sameInstant(DEFAULT_UPDATE_DATE)))
            .andExpect(jsonPath("$.closeDate").value(sameInstant(DEFAULT_CLOSE_DATE)))
            .andExpect(jsonPath("$.symbol").value(DEFAULT_SYMBOL))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.limitOrMarket").value(DEFAULT_LIMIT_OR_MARKET.toString()))
            .andExpect(jsonPath("$.volume").value(DEFAULT_VOLUME.doubleValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.totalAmount").value(DEFAULT_TOTAL_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.categoryToken").value(DEFAULT_CATEGORY_TOKEN.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingOrder() throws Exception {
        // Get the order
        restOrderMockMvc.perform(get("/api/orders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrder() throws Exception {
        // Initialize the database
        orderService.save(order);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockOrderSearchRepository);

        int databaseSizeBeforeUpdate = orderRepository.findAll().size();

        // Update the order
        Order updatedOrder = orderRepository.findById(order.getId()).get();
        // Disconnect from session so that the updates on updatedOrder are not directly saved in db
        em.detach(updatedOrder);
        updatedOrder
            .idOrder(UPDATED_ID_ORDER)
            .refOrder(UPDATED_REF_ORDER)
            .createDate(UPDATED_CREATE_DATE)
            .updateDate(UPDATED_UPDATE_DATE)
            .closeDate(UPDATED_CLOSE_DATE)
            .symbol(UPDATED_SYMBOL)
            .type(UPDATED_TYPE)
            .limitOrMarket(UPDATED_LIMIT_OR_MARKET)
            .volume(UPDATED_VOLUME)
            .price(UPDATED_PRICE)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .categoryToken(UPDATED_CATEGORY_TOKEN)
            .status(UPDATED_STATUS)
            .active(UPDATED_ACTIVE);

        restOrderMockMvc.perform(put("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrder)))
            .andExpect(status().isOk());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
        Order testOrder = orderList.get(orderList.size() - 1);
        assertThat(testOrder.getIdOrder()).isEqualTo(UPDATED_ID_ORDER);
        assertThat(testOrder.getRefOrder()).isEqualTo(UPDATED_REF_ORDER);
        assertThat(testOrder.getCreateDate()).isEqualTo(UPDATED_CREATE_DATE);
        assertThat(testOrder.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testOrder.getCloseDate()).isEqualTo(UPDATED_CLOSE_DATE);
        assertThat(testOrder.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testOrder.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testOrder.getLimitOrMarket()).isEqualTo(UPDATED_LIMIT_OR_MARKET);
        assertThat(testOrder.getVolume()).isEqualTo(UPDATED_VOLUME);
        assertThat(testOrder.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testOrder.getTotalAmount()).isEqualTo(UPDATED_TOTAL_AMOUNT);
        assertThat(testOrder.getCategoryToken()).isEqualTo(UPDATED_CATEGORY_TOKEN);
        assertThat(testOrder.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testOrder.isActive()).isEqualTo(UPDATED_ACTIVE);

        // Validate the Order in Elasticsearch
        verify(mockOrderSearchRepository, times(1)).save(testOrder);
    }

    @Test
    @Transactional
    public void updateNonExistingOrder() throws Exception {
        int databaseSizeBeforeUpdate = orderRepository.findAll().size();

        // Create the Order

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderMockMvc.perform(put("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Order in Elasticsearch
        verify(mockOrderSearchRepository, times(0)).save(order);
    }

    @Test
    @Transactional
    public void deleteOrder() throws Exception {
        // Initialize the database
        orderService.save(order);

        int databaseSizeBeforeDelete = orderRepository.findAll().size();

        // Delete the order
        restOrderMockMvc.perform(delete("/api/orders/{id}", order.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Order in Elasticsearch
        verify(mockOrderSearchRepository, times(1)).deleteById(order.getId());
    }

    @Test
    @Transactional
    public void searchOrder() throws Exception {
        // Initialize the database
        orderService.save(order);
        when(mockOrderSearchRepository.search(queryStringQuery("id:" + order.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(order), PageRequest.of(0, 1), 1));
        // Search the order
        restOrderMockMvc.perform(get("/api/_search/orders?query=id:" + order.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(order.getId().intValue())))
            .andExpect(jsonPath("$.[*].idOrder").value(hasItem(DEFAULT_ID_ORDER)))
            .andExpect(jsonPath("$.[*].refOrder").value(hasItem(DEFAULT_REF_ORDER.intValue())))
            .andExpect(jsonPath("$.[*].createDate").value(hasItem(sameInstant(DEFAULT_CREATE_DATE))))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(sameInstant(DEFAULT_UPDATE_DATE))))
            .andExpect(jsonPath("$.[*].closeDate").value(hasItem(sameInstant(DEFAULT_CLOSE_DATE))))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].limitOrMarket").value(hasItem(DEFAULT_LIMIT_OR_MARKET.toString())))
            .andExpect(jsonPath("$.[*].volume").value(hasItem(DEFAULT_VOLUME.doubleValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].totalAmount").value(hasItem(DEFAULT_TOTAL_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].categoryToken").value(hasItem(DEFAULT_CATEGORY_TOKEN.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())));
    }
}
