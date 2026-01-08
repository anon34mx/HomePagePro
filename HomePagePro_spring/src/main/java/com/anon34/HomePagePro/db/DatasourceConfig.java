package com.anon34.HomePagePro.db;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatasourceConfig {
@Autowired Environment env;

@Bean
public DataSource dataSource() {
    final DriverManagerDataSource dataSource = new DriverManagerDataSource();
        // dataSource.setDriverClassName(env.getProperty("driverClassName"));
        // dataSource.setUrl(env.getProperty("url"));
        // dataSource.setUsername(env.getProperty("user"));
        // dataSource.setPassword(env.getProperty("password"));
        dataSource.setDriverClassName("org.sqlite.JDBC");
        dataSource.setUrl("jdbc:sqlite:hpp_db.db");
        dataSource.setUsername("user");
        dataSource.setPassword("password");
        return dataSource;
    }
}
