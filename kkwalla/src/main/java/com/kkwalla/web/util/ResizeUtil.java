package com.kkwalla.web.util;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;

public class ResizeUtil {

	// 리사이즈 대상 이미지의 크기와 포맷 설정
	public static void imageFormat(String imgSrc, String imgPath, String imgName) throws IOException {
		// 이미지 크기 설정
		int setWidth = 1000;
		int setHeight = 1000;

		// 원본 이미지 읽기
		FileInputStream inputStream = new FileInputStream(imgSrc);
		Image originImage = new ImageIcon(imgSrc.toString()).getImage();
		int originImageWidth = originImage.getWidth(null);
		// int originImageHeight = originImage.getHeight(null);

		// 원본 크기가 변환할 크기보다 크면 변환 실행
		if (originImageWidth > setWidth) {
			try {
				// 리사이즈 메소드에서 그린 이미지 버퍼에 담기
				BufferedImage img = resizeImage(inputStream, setWidth, setHeight);

				// 버퍼의 이미지 출력("확장자", (경로, 접두어, 파일이름))
				ImageIO.write(img, "jpg", new File(imgPath + "re_" + imgName));

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	// 리사이즈 실행
	public static BufferedImage resizeImage(InputStream inputStream, int width, int height) throws IOException {

		double ratio;
		int afterWidth;
		int afterHeight;

		// 이미지 읽어와 버퍼 생성
		BufferedImage beforeImage = ImageIO.read(inputStream);
		int beforeWidth = beforeImage.getWidth(null);
		int beforeHeight = beforeImage.getHeight(null);

		// 리사이징 기준 설정 W:넓이 H:높이
		String mainPosition = "W";

		if (mainPosition.equals("W")) {
			// 가로 기준
			ratio = (double) width / (double) beforeWidth;
			afterWidth = (int) (beforeWidth * ratio);
			afterHeight = (int) (beforeHeight * ratio);
		} else if (mainPosition.equals("H")) {
			// 세로 기준
			ratio = (double) height / (double) beforeHeight;
			afterWidth = (int) (beforeWidth * ratio);
			afterHeight = (int) (beforeHeight * ratio);
		} else {
			// 비율 무시
			afterWidth = width;
			afterHeight = height;
		}

		// 변환 크기, 비율, 변환 알고리즘 설정
		Image image = beforeImage.getScaledInstance(afterWidth, afterHeight, Image.SCALE_SMOOTH);

		BufferedImage afterImage = new BufferedImage(afterWidth, afterHeight, BufferedImage.TYPE_INT_RGB);

		afterImage.createGraphics().drawImage(beforeImage, 0, 0, Color.white, null);
		Graphics graphics = afterImage.getGraphics();
		graphics.drawImage(image, 0, 0, null);
		graphics.dispose();

		return afterImage;
	}
}
