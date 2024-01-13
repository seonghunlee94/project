package com.kkwalla.web.controller;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kkwalla.web.service.FaceService;
import com.kkwalla.web.util.ResizeUtil;


@RestController
public class FaceController {
	
	@Autowired
	FaceService faceService;
	
	@PostMapping("face")
	public String upload(@RequestParam("imgFile") MultipartFile file, HttpServletRequest request) {

		String imgPath = request.getServletContext().getRealPath("/WEB-INF/image/"); // 이미지 경로
		String imgName = file.getOriginalFilename(); // 이미지 이름
		String imgSrc = imgPath+imgName; // 이미지 소스
		
		try {
			file.transferTo(new File(imgSrc)); // 이미지 서버 저장
			
			ResizeUtil.imageFormat(imgSrc, imgPath, imgName); // 이미지 리사이징
			
			String reImgSrc = imgPath+"re_"+imgName; // 리사이징된 이미지
			System.out.println(reImgSrc);
			File imgFile = new File(reImgSrc);
			if(imgFile.exists()) {
				return faceService.faceRecognize(reImgSrc); // 네이버 API로 얼굴 상태 분석
				
			} else {
				return faceService.faceRecognize(imgSrc);
			}
				
		} catch(IllegalStateException e) {  // 서버에 이미지를 저장할 때 오류가 발생 할 경우
			return "이미지 저장 오류가 났어요! 담당자에게 연락부탁드려요"; 
		} catch(IOException e) { // 데이터 전송간의 오류가 발생할 경우
			return "데이터 전송 오류가 났어요! 담당자에게 연락부탁드려요";
		} catch(BadSqlGrammarException e) {  // 서버와 연결이 불안정할 경우
			return "서버 연결이 불안정해요! 담당자에게 연락부탁드려요";
		} catch(ParseException e) { // 네이버 api에서 parse형식이 변경된 경우
			return "500 에러 오류가 났어요! 담당자에게 연락부탁드려요";
		} catch(IndexOutOfBoundsException e) { // 얼굴이 아닌 부분을 찍어 네이버 api에서 인식을 못할 경우
			String[] a = {"얼굴을 찍어 보여주세요","얼굴이 어디있나요? 안보이네요","바닥인가요? 얼굴인가요?"};
		    return a[(int)(Math.random() * a.length)];
		} catch(Exception e) { // 그 밖의 오류
			return "오류가 났어요! 담당자에게 연락부탁드려요";
		}
	}
}
