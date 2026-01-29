package com.shopifyy.shopifyy.security.config;

import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
public class LLMConfig {
/*
    @Value("${spring.ai.openai.embedding.options.model}")
    private String model;

    @Value("${spring.ai.openai.api-key}")
    private String openaiApiKey;

    @Value("${spring.ai.openai.api.url}")
    private String openaiApiUrl;

    @Value("${spring.ai.openai.api.temperature}")
    private Double openaiApiTemperature;


    @NotNull
    public Request getRequest(String prompt) {
        MediaType mediaType = MediaType.parse("application/json");
        JSONObject jsonBody = new JSONObject();
        jsonBody.put("model", model);
        jsonBody.put("input", prompt);
        jsonBody.put("temperature", openaiApiTemperature);

        RequestBody body = RequestBody.create(jsonBody.toString(), mediaType);
        return new Request.Builder()
                .url(openaiApiUrl)
                .post(body)
                .addHeader("Authorization", "Bearer " + openaiApiKey)
                .addHeader("Content-Type", "application/json")
                .build();
    }*/
  }
