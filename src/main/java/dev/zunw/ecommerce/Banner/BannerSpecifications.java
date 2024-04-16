package dev.zunw.ecommerce.Banner;

import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class BannerSpecifications {
    public static Specification<Banner> withAllFilters(
            List<Long> categoryIds, List<Long> statusIds, String searchQuery) {
        Specification<Banner> spec = Specification.where(withCategories(categoryIds))
                .and(withStatus(statusIds));

        if (searchQuery != null && !searchQuery.isEmpty()) {
            spec = spec.and(withSearch(searchQuery));
        }

        return spec;
    }

    public static Specification<Banner> withCategories(List<Long> categoryIds) {
        return (root, query, builder) -> {
            if (categoryIds != null && !categoryIds.isEmpty()) {
                return root.get("category").get("categoryId").in(categoryIds);
            }
            return null;
        };
    }

    public static Specification<Banner> withStatus(List<Long> statusIds) {
        return (root, query, builder) -> {
            if (statusIds != null && !statusIds.isEmpty()) {
                return root.get("status").get("statusId").in(statusIds);
            }
            return null;
        };
    }

    public static Specification<Banner> withSearch(String searchQuery) {
        return (root, query, builder) -> {
            if (searchQuery != null) {
                return builder.like(builder.lower(root.get("name")), "%" + searchQuery.toLowerCase() + "%");
            }
            return null;
        };
    }
}
