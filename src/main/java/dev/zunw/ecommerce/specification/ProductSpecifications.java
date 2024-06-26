package dev.zunw.ecommerce.specification;

import dev.zunw.ecommerce.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ProductSpecifications {

    public static Specification<Product> withAllFilters(
            List<Long> categoryIds, List<Long> brandIds, List<Long> statusIds, String searchQuery) {
        Specification<Product> spec = Specification.where(withCategories(categoryIds))
                .and(withBrands(brandIds))
                .and(withStatus(statusIds));

        if (searchQuery != null && !searchQuery.isEmpty()) {
            spec = spec.and(withSearch(searchQuery));
        }

        return spec;
    }

    public static Specification<Product> withCategories(List<Long> categoryIds) {
        return (root, query, builder) -> {
            if (categoryIds != null && !categoryIds.isEmpty()) {
                return root.get("category").get("categoryId").in(categoryIds);
            }
            return null;
        };
    }

    public static Specification<Product> withBrands(List<Long> brandIds) {
        return (root, query, builder) -> {
            if (brandIds != null && !brandIds.isEmpty()) {
                return root.get("brand").get("brandId").in(brandIds);
            }
            return null;
        };
    }

    public static Specification<Product> withStatus(List<Long> statusIds) {
        return (root, query, builder) -> {
            if (statusIds != null && !statusIds.isEmpty()) {
                return root.get("status").get("statusId").in(statusIds);
            }
            return null;
        };
    }

    public static Specification<Product> withSearch(String searchQuery) {
        return (root, query, builder) -> {
            if (searchQuery != null) {
                return builder.like(builder.lower(root.get("name")), "%" + searchQuery.toLowerCase() + "%");
            }
            return null;
        };
    }
}