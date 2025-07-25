package org.jobis.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Controller
@CrossOrigin("*")
@RequestMapping("/files")
public class FileUploadController {

    // (선택) 컨테이너 루트 경로가 필요하면 주입
    @Autowired
    private ServletContext servletContext;

    @PostMapping("/upload/profileImage")
    public ResponseEntity<?> uploadProfileImage( @RequestParam("image") MultipartFile image, @RequestParam("uno") int uno) {

        if (image.isEmpty() || uno <= 0) {
            return ResponseEntity.badRequest().body("잘못된 요청입니다.");
        }

        String baseDir = "Z:/profile/usercustom/";
        String fileName = uno + ".png";
        Path filePath = Paths.get(baseDir, fileName);

        try {
            // 폴더 없으면 생성
            Files.createDirectories(Paths.get(baseDir));

            // 기존 파일 삭제
            Files.deleteIfExists(filePath);

            // 파일 저장 (무조건 png만 허용)
            if (!image.getOriginalFilename().toLowerCase().endsWith(".png")) {
                return ResponseEntity.badRequest().body("PNG 형식만 허용됩니다.");
            }

            image.transferTo(filePath.toFile());

            return ResponseEntity.ok("프로필 이미지 업로드 성공");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류: 저장 실패");
        }
    }
}
