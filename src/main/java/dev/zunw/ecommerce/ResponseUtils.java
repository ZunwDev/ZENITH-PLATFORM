package dev.zunw.ecommerce;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

public class ResponseUtils {
    public static ResponseEntity<Object> successResponse(String message, String action, Optional<Object> affectedObject) {
        Map<String, Object> response = new java.util.HashMap<>();

        if (message != null) {
            response.put("message", "<span>" + message + ".</span>");
        }

        if (action != null) {
            response.put("action", action);
        }

        affectedObject.ifPresent(obj -> {
            if (obj instanceof Map) {
                response.putAll((Map<String, Object>) obj);
            } else {
                response.put("data", obj);
            }
        });

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public static ResponseEntity<Object> successResponse(Object object) {
        return ResponseEntity.status(HttpStatus.OK).body(object);
    }

    public static ResponseEntity<Object> createdResponse(String message, String action, Optional<Object> affectedObject) {
        Map<String, Object> response = new java.util.HashMap<>(Map.ofEntries(
                affectedObject.map(obj -> Map.entry("object", obj)).orElse(null)
        ));

        if (message != null) {
            response.put("message", "<span>" + message + ".</span>");
        }

        if (action != null) {
            response.put("action", action);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public static ResponseEntity<Object> conflictResponse(String message) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "<span>" + message + ".</span>", "errorCode", 409));
    }

    public static ResponseEntity<Object> conflictAlreadyExistsResponse(String type, String name) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "<span>" + type + "named <strong>" + name + "</strong> " +
                                "already exists" +
                                ".</span>", "errorCode",
                        409));
    }

    public static ResponseEntity<Object> serverErrorResponse(String message) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "<span>" + message + ".</span>", "errorCode", 500));
    }

    public static ResponseEntity<Object> notFoundResponse(String message) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "<span>" + message + ".</span>", "errorCode", 404));
    }

    public static ResponseEntity<Object> noContentResponse(String message) {
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(Map.of("message", "<span>" + message + ".</span>", "errorCode", 204));
    }

    public static ResponseEntity<Object> unauthorizedResponse(String message) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "<span>" + message + ".</span>", "errorCode", 401));
    }

    public static ResponseEntity<Object> badRequestResponse(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "<span>" + message + ".</span>", "errorCode", 400));
    }
}
