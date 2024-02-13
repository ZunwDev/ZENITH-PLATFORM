package dev.zunw.ecommerce.Product;

import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ProductSpecifications {

    public static Specification<Product> withCategoryAndBrandAndArchived(
            List<Long> categoryIds, List<Long> brandIds, List<Boolean> archivedIds) {
        return Specification.where(withCategories(categoryIds))
                .and(withBrands(brandIds))
                .and(withArchived(archivedIds));
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

    public static Specification<Product> withArchived(List<Boolean> archivedIds) {
        return (root, query, builder) -> {
            if (archivedIds != null && !archivedIds.isEmpty()) {
                return root.get("archived").in(archivedIds);
            }
            return null;
        };
    }
}