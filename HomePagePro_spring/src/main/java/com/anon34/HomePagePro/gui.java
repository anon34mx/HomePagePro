package com.anon34.HomePagePro;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.lang.Thread.State;

public class gui {
    static ConfigurableApplicationContext context;
	static JButton btn_start;
    public static void main(String[] args) {
        JFrame v=new JFrame();
		JPanel pnl=new JPanel();
		pnl.add(new JLabel("Bienvenido"));
		btn_start=new JButton();
		btn_start.add(new JLabel("correr"));
		JButton btn_stop=new JButton();
		btn_stop.add(new JLabel("Detener"));
		pnl.add(btn_start);
		
		btn_start.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e){
				start_server();
			}
		});
		btn_stop.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e){
				System.out.println("Stopping server...");
				context.close();
			}
		});
		pnl.add(btn_stop);
		v.add(pnl);
		v.setSize(600, 480);
		v.setVisible(true);
		v.setAlwaysOnTop(false);
		v.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		
	}

	private static void start_server(){
		System.out.println("Server startted");
		context = SpringApplication.run(HomePageProApplication.class, new String[]{});
	}

	private static void restart_server() {
        ApplicationArguments args = context.getBean(ApplicationArguments.class);

        Thread thread = new Thread(() -> {
            context.close();
            context = SpringApplication.run(HomePageProApplication.class, args.getSourceArgs());
        });

        thread.interrupt();
        thread.start();
    }
}
