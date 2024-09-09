package com.zmanager.backendzmanager;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
public class BackendZManagerApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .directory("/Users/kurtik/Projects/Z_manager_web_app") // Set this to your project root
                .load();

        // Set environment variables
        System.setProperty("SUPABASE_DB_URL", dotenv.get("SUPABASE_DB_URL"));
        System.setProperty("SUPABASE_DB_USERNAME", dotenv.get("SUPABASE_DB_USERNAME"));
        System.setProperty("SUPABASE_DB_PASSWORD", dotenv.get("SUPABASE_DB_PASSWORD"));

        SpringApplication.run(BackendZManagerApplication.class, args);
    }
}