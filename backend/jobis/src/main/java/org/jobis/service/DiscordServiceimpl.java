package org.jobis.service;

import org.jobis.domain.UserVO;
import org.jobis.mapper.DiscordMapper;
import org.jobis.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DiscordServiceimpl implements DiscordService{
	@Autowired private DiscordMapper dMapper;
	
	public String getUserName(int uno) {
		return dMapper.getNicknameByUno(uno);
	}
}
