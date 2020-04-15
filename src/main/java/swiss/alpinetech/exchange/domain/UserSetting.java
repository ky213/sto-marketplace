package swiss.alpinetech.exchange.domain;

import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;

import swiss.alpinetech.exchange.domain.enumeration.COUNTRY;

/**
 * Home page Dashborad.\n@author Charles
 */
@ApiModel(description = "Home page Dashborad.\n@author Charles")
@Entity
@Table(name = "user_setting")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "usersetting")
public class UserSetting implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date_of_birth", nullable = false)
    private ZonedDateTime dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "nationality")
    private COUNTRY nationality;

    @Size(min = 6, max = 15)
    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Size(min = 2, max = 50)
    @Column(name = "position", length = 50)
    private String position;

    @Column(name = "address")
    private String address;

    @Size(min = 2, max = 8)
    @Column(name = "code", length = 8)
    private String code;

    @Size(min = 2, max = 50)
    @Column(name = "city", length = 50)
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(name = "country")
    private COUNTRY country;

    @NotNull
    @Size(min = 14, max = 35)
    @Column(name = "iban", length = 35, nullable = false)
    private String iban;

    @Size(min = 40, max = 42)
    @Column(name = "eth_address", length = 42)
    private String ethAddress;

    @Min(value = 0)
    @Max(value = 5)
    @Column(name = "risk_profil")
    private Integer riskProfil;

    @Column(name = "balance")
    private Double balance;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDateOfBirth() {
        return dateOfBirth;
    }

    public UserSetting dateOfBirth(ZonedDateTime dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
        return this;
    }

    public void setDateOfBirth(ZonedDateTime dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public COUNTRY getNationality() {
        return nationality;
    }

    public UserSetting nationality(COUNTRY nationality) {
        this.nationality = nationality;
        return this;
    }

    public void setNationality(COUNTRY nationality) {
        this.nationality = nationality;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public UserSetting phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPosition() {
        return position;
    }

    public UserSetting position(String position) {
        this.position = position;
        return this;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getAddress() {
        return address;
    }

    public UserSetting address(String address) {
        this.address = address;
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCode() {
        return code;
    }

    public UserSetting code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCity() {
        return city;
    }

    public UserSetting city(String city) {
        this.city = city;
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public COUNTRY getCountry() {
        return country;
    }

    public UserSetting country(COUNTRY country) {
        this.country = country;
        return this;
    }

    public void setCountry(COUNTRY country) {
        this.country = country;
    }

    public String getIban() {
        return iban;
    }

    public UserSetting iban(String iban) {
        this.iban = iban;
        return this;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }

    public String getEthAddress() {
        return ethAddress;
    }

    public UserSetting ethAddress(String ethAddress) {
        this.ethAddress = ethAddress;
        return this;
    }

    public void setEthAddress(String ethAddress) {
        this.ethAddress = ethAddress;
    }

    public Integer getRiskProfil() {
        return riskProfil;
    }

    public UserSetting riskProfil(Integer riskProfil) {
        this.riskProfil = riskProfil;
        return this;
    }

    public void setRiskProfil(Integer riskProfil) {
        this.riskProfil = riskProfil;
    }

    public Double getBalance() {
        return balance;
    }

    public UserSetting balance(Double balance) {
        this.balance = balance;
        return this;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public User getUser() {
        return user;
    }

    public UserSetting user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserSetting)) {
            return false;
        }
        return id != null && id.equals(((UserSetting) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "UserSetting{" +
            "id=" + getId() +
            ", dateOfBirth='" + getDateOfBirth() + "'" +
            ", nationality='" + getNationality() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", position='" + getPosition() + "'" +
            ", address='" + getAddress() + "'" +
            ", code='" + getCode() + "'" +
            ", city='" + getCity() + "'" +
            ", country='" + getCountry() + "'" +
            ", iban='" + getIban() + "'" +
            ", ethAddress='" + getEthAddress() + "'" +
            ", riskProfil=" + getRiskProfil() +
            ", balance=" + getBalance() +
            "}";
    }
}
