package com.kkwalla.web.service;



import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import org.springframework.stereotype.Service;

import com.kkwalla.web.util.PronUtil;


@Service
public class PronService {

	public JSONObject pronAnalysis(String sentence, String fileName) throws ParseException {
		
		String resultMSG = PronUtil.request(fileName);
		//result parser
		JSONParser parser = new JSONParser();
		JSONObject obj = (JSONObject) parser.parse(resultMSG);
		JSONObject obj2 = (JSONObject) obj.get("return_object");
		String answer = (String) obj2.get("recognized");
		System.out.println(answer);
		if(answer.length()>sentence.length()/4) { //문장 길이 하한선 조정
			return scoring(sentence, answer);
		}else {
			return null;
		}
	}

	
	public JSONObject scoring(String sentence, String answer) {
        
        System.out.println(sentence);
		String trimSentence = sentence.replaceAll("\\p{Z}", "");
		String trimAnswer = answer.replaceAll("\\p{Z}", "");
		int sentenceLen = trimSentence.length() + 1;
		int answerLen = trimAnswer.length() + 1; // 긴 단어 만큼 크기가 나올 것이므로, 가장 긴 단어에 맞춰 Cost를 계산
		int[] cost = new int[sentenceLen];
		int[] newcost = new int[sentenceLen]; // 초기 비용을 가장 긴 배열에 맞춰서 초기화 시킨다.

		//앞문장 후처리
		String frontEdit = null;
		for (int k = 1; k < answerLen; k++) {
			for (int i = 1; i < sentenceLen && frontEdit == null; i++) {
				if (trimSentence.charAt(i - 1) == trimAnswer.charAt(k - 1)) {
					frontEdit = trimAnswer.substring(k - 1);
				}
			}
		}
		
		//뒷문장 후처리
		if(frontEdit.length()>0) {
			String backEdit = null;
			int frontLen = frontEdit.length();
			for (int k = frontLen; k > 0; k--) {
				for (int i = sentenceLen - 1; i > 0 && backEdit == null; i--) {
					if (trimSentence.charAt(i - 1) == frontEdit.charAt(k - 1)) {
						backEdit = frontEdit.substring(0, k);
					}
				}
			}
			
			//평가 프로세스
			if(backEdit.length()>0) {
				int backLen = backEdit.length() + 1;
				for (int i = 0; i < sentenceLen; i++) {
					cost[i] = i;
				}
				for (int j = 1; j < backLen; j++) {
					
					newcost[0] = j;
					for (int i = 1; i < sentenceLen; i++) {
						
						int match = 0;
						if (trimSentence.charAt(i - 1) != backEdit.charAt(j - 1)) {
							match = 1;
						}
						
						int replace = cost[i - 1] + match;
						int insert = cost[i] + 1;
						int delete = newcost[i - 1] + 1;
						
						newcost[i] = Math.min(Math.min(insert, delete), replace);
					} 
					int[] temp = cost;
					cost = newcost;
					newcost = temp;
				}
				//평가 결과, 틀린 개수 산출
				double errorNum = (double) (cost[sentenceLen - 1]);
				int score = (int) (errorNum / trimSentence.length() * 100);
				
				// grading calculation
				return grading(errorNum, sentenceLen,score);
			}else {
				return null;
			}
		}else {
			return null;
		}
	}

	
	public JSONObject grading(Double errorNum, int sentenceLen, double score) {
		String ranking = "";
		if (errorNum <=sentenceLen * 0.15 && errorNum >=0 ) {
			ranking = "주당";
		} else if (errorNum <= sentenceLen * 0.3 && errorNum > sentenceLen * 0.15) {
			ranking = "주객";
		} else if (errorNum <= sentenceLen * 0.45 && errorNum > sentenceLen * 0.3) {
			ranking = "취객";
		} else if (errorNum <= sentenceLen * 0.6 && errorNum > sentenceLen * 0.45) {
			ranking = "꽐라";
		} else if (errorNum <= sentenceLen && errorNum > sentenceLen * 0.6) {
			ranking = "개꽐라";
		}
		JSONObject pronJson= new JSONObject();
		pronJson.put("ranking", ranking);
		pronJson.put("score", score);
				
		return pronJson;
	}

}
