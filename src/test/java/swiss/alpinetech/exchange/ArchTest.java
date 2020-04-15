package swiss.alpinetech.exchange;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("swiss.alpinetech.exchange");

        noClasses()
            .that()
                .resideInAnyPackage("swiss.alpinetech.exchange.service..")
            .or()
                .resideInAnyPackage("swiss.alpinetech.exchange.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..swiss.alpinetech.exchange.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}
