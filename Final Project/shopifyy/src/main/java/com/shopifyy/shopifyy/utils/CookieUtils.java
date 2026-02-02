package com.shopifyy.shopifyy.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CookieUtils {

    @Value("${app.useSecureCookie}")
    private boolean useSecureCookie;

    public void addRefreshTokenCookie(HttpServletResponse response, String refreshToken, long maxAge) {
        if (response == null) {
            throw new IllegalArgumentException("HttpServletResponse cannot be null");
        }
        
        // Calculate seconds for Max-Age
        int maxAgeSeconds = (int) (maxAge / 1000);
        
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(maxAgeSeconds);
        refreshTokenCookie.setSecure(useSecureCookie);
        
        // SameSite attribute must be set via header for cross-origin scenarios
        String sameSite = useSecureCookie ? "None" : "Lax";
        setResponseHeader(response, refreshTokenCookie, sameSite);
    }

    private void setResponseHeader(HttpServletResponse response, Cookie cookie, String sameSite) {
        StringBuilder cookieHeader = new StringBuilder();
        cookieHeader.append(cookie.getName()).append("=").append(cookie.getValue())
                .append("; HttpOnly")
                .append("; Path=").append(cookie.getPath())
                .append("; Max-Age=").append(cookie.getMaxAge())
                .append(useSecureCookie ? "; Secure" : "")
                .append("; SameSite=").append(sameSite);
                
        response.addHeader("Set-Cookie", cookieHeader.toString());
    }

    public String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    public void logCookies(HttpServletRequest request) {
        // Only log in debug mode to keep production logs clean
        if (log.isDebugEnabled()) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    log.debug("Cookie received: name={}, value={}", cookie.getName(), "HIDDEN_FOR_SECURITY");
                }
            } else {
                log.debug("No cookies received in request");
            }
        }
    }
}