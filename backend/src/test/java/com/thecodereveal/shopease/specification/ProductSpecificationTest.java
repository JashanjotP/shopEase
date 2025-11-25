package com.thecodereveal.shopease.specification;

import com.thecodereveal.shopease.entities.Product;
import jakarta.persistence.criteria.*;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

import static org.mockito.Mockito.*;

public class ProductSpecificationTest {

    @Test
    public void testHasCategoryId() {
        UUID categoryId = UUID.randomUUID();
        Specification<Product> spec = ProductSpecification.hasCategoryId(categoryId);

        Root<Product> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder criteriaBuilder = mock(CriteriaBuilder.class);
        Path categoryPath = mock(Path.class);
        Path idPath = mock(Path.class);

        when(root.get("category")).thenReturn(categoryPath);
        when(categoryPath.get("id")).thenReturn(idPath);
        
        spec.toPredicate(root, query, criteriaBuilder);

        verify(criteriaBuilder).equal(idPath, categoryId);
    }

    @Test
    public void testHasCategoryTypeId() {
        UUID typeId = UUID.randomUUID();
        Specification<Product> spec = ProductSpecification.hasCategoryTypeId(typeId);

        Root<Product> root = mock(Root.class);
        CriteriaQuery<?> query = mock(CriteriaQuery.class);
        CriteriaBuilder criteriaBuilder = mock(CriteriaBuilder.class);
        Path categoryTypePath = mock(Path.class);
        Path idPath = mock(Path.class);

        when(root.get("categoryType")).thenReturn(categoryTypePath);
        when(categoryTypePath.get("id")).thenReturn(idPath);

        spec.toPredicate(root, query, criteriaBuilder);

        verify(criteriaBuilder).equal(idPath, typeId);
    }
}
