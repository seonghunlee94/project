package com.kkwalla.web.util;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Arrays;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;

public class WavToRaw {

	private static FileInputStream fstream = null;
	private static byte[] audioBytes = new byte[1024];
	private static byte[] buff = new byte[1024];
	private static int read;

	public WavToRaw() {
		super();
		// TODO Auto-generated constructor stub
	}

	// 리니어 PCM 인코딩 및 지정된 파라미터를 가지는 AudioFormat를 구축합니다.
	// http://cris.joongbu.ac.kr/course/java/api/javax/sound/sampled/AudioFormat.html
	private static final AudioFormat FORMAT = new AudioFormat(
		16_000, // 16 kHz, sampleRate
		16, // 16 bits, sampleSizeInBits
		1, // Mono, int channels
		true, // Signed
		false // Little endian, True is BigEndian
	);

	//바이트 배열을 Raw 파일로 저장
	//Save byte array as Raw file
	public static void SaveRaw(File file) throws UnsupportedAudioFileException {
		OutputStream output = null;
        String fileName = file.getName();
        int idx = fileName.lastIndexOf(".");
        String _fileName = fileName.substring(0, idx);
		try {
			output = new FileOutputStream("src\\main\\webapp\\WEB-INF\\audio\\"+_fileName+".raw");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		try {
			//핵심 코드
			//core code
			output.write(formatWavToRaw(changeFormat(AudioToByte(file), FORMAT)));

			//Can delete
			//Just Test Code
			System.out.print("Success");
			output.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	
	
	
	
	
	//Wav 파일에서 헤더 제거
	//Strip the header from the WAV file
	private static byte[] formatWavToRaw( final byte[] audioFileContent) {
		return Arrays.copyOfRange(audioFileContent, 44, audioFileContent.length);
	}

	//기존의 Wav 파일(바이트 배열) 을 다른 형식의 Wav 형식 (바이트 배열) 로 변환
	//WAV to WAV (different audio format)
	private static byte[] changeFormat( final byte[] audioFileContent,  final AudioFormat audioFormat)
			throws IOException, UnsupportedAudioFileException {
		try (final AudioInputStream originalAudioStream = AudioSystem
				.getAudioInputStream(new ByteArrayInputStream(audioFileContent));
				final AudioInputStream formattedAudioStream = AudioSystem.getAudioInputStream(audioFormat,
						originalAudioStream);
				final AudioInputStream lengthAddedAudioStream = new AudioInputStream(formattedAudioStream, audioFormat,
						audioFileContent.length);
				final ByteArrayOutputStream convertedOutputStream = new ByteArrayOutputStream()) {
			AudioSystem.write(lengthAddedAudioStream, AudioFileFormat.Type.WAVE, convertedOutputStream);
			return convertedOutputStream.toByteArray();
		}
	}

	//기존의 wav 파일을 바이트 배열로 변환
	//Convert existing wav file to byte array
	private static byte[] AudioToByte(File file) {
		try {
			File inFile = file;
			fstream = new FileInputStream(inFile);

			ByteArrayOutputStream out = new ByteArrayOutputStream();
			BufferedInputStream in = new BufferedInputStream(fstream);

			while ((read = in.read(buff)) > 0) {
				out.write(buff, 0, read);
			}
			out.flush();
			audioBytes = out.toByteArray();

			// Do something with the stream
		} catch (FileNotFoundException ex) {

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return audioBytes;
	}

}
