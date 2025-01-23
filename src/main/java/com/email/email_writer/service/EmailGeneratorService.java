package com.email.email_writer.service;

import com.email.email_writer.EmailRequest;
import org.springframework.stereotype.Service;

@Service
public class EmailGeneratorService {

    public String generateEmailReply(EmailRequest emailRequest) {
        // build the prompt
        String prompt = biuldPrompt(emailRequest);
        // craft a request
        // request and get response
    }

    public String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append(
            "Generate a proffesional email reply for the following email content. Please don't generate a subject line."
        );
        if (
            emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()
        ) {
            prompt
                .append("Use a ")
                .append(emailRequest.getTone())
                .append(" tone.");
        }
        prompt
            .append("\nOriginal email: \n")
            .append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
