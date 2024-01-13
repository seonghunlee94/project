package com.kkwalla.web.controller;

import java.io.Console;
import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
public class FaceController {
	
	
	@PostMapping("face")
	public String upload(@RequestParam("imgFile") MultipartFile file, HttpServletRequest request) throws IllegalStateException, IOException {

		String imgPath = request.getServletContext().getRealPath("/WEB-INF/image/"); // 이미지 경로
		String imgName = file.getOriginalFilename(); // 이미지 이름
		String imgSrc =imgPath+imgName; // 이미지 소스
		
		file.transferTo(new File(imgSrc)); 
		return null; 
		
		}		
	}
