package com.kkwalla.web.controller;

import java.io.File;
import java.io.IOException;


import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.kkwalla.web.service.PronService;


@RestController
public class PronController {

	@Autowired
	PronService pronService;

	@PostMapping("saveRecord")
	public void pronTest(@RequestParam("audioFile") MultipartFile file, HttpServletRequest request) {

		String audioPath = request.getServletContext().getRealPath("/WEB-INF/audio/"); // 오디오 경로
		String audioName = file.getOriginalFilename(); 
		String audioSrc = audioPath + audioName; 

		try {
			file.transferTo(new File(audioSrc)); // 오디오 서버 저장
		} catch (IllegalStateException e) { // 서버에 이미지를 저장 할때 오류가 발생 할 경우
			System.out.println("서버에 이미지가 저장이 안되고 있어요");
		} catch (IOException e) { // 데이터 전송간의 오류가 발생할 경우
			System.out.println("데이터 전송간의 오류가 있어요");
		} catch (Exception e) { // 그 밖의 오류
			System.out.println("예상치 못한 오류가 있어요");
		}
	}

	@PostMapping("pron")
	public String pronTest(@RequestParam("sentence") String sentence, @RequestParam("fileName") String fileName) {
		JSONObject pronJson;
		try {
			System.out.println("pronController 도착");
			pronJson=pronService.pronAnalysis(sentence, fileName); 
			
			if (pronJson != null) {
				System.out.println("이제 서버로 보내요~");
				return pronJson.toJSONString();
			} else {
				throw new NullPointerException();
			}
		} catch (NullPointerException e) {
			return "무슨 말씀하시는 거죠??다시 측정 해주세요.";
		} catch (Exception e) {
			e.printStackTrace();
			return "담당자에게 연락부탁드립니다";
		}
	}

}
