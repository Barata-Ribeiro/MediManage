package com.barataribeiro.medimanage.builders;

import com.barataribeiro.medimanage.dtos.raw.UserContextDTO;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimpleDoctorDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimpleUserDTO;
import com.barataribeiro.medimanage.entities.models.User;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserMapper {
    private final ModelMapper modelMapper;

    public UserDTO toDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    public UserContextDTO toContextDTO(User user) {
        return modelMapper.map(user, UserContextDTO.class);
    }

    public SimpleUserDTO toSimpleDTO(User user) {
        return modelMapper.map(user, SimpleUserDTO.class);
    }

    public SimpleDoctorDTO toSimpleDoctorDTO(User user) {
        return modelMapper.map(user, SimpleDoctorDTO.class);
    }

    public User toEntity(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }

    public List<UserDTO> toDTOList(@NotNull List<User> users) {
        return users.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<UserContextDTO> toContextDTOList(@NotNull List<User> users) {
        return users.stream()
                .map(this::toContextDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<SimpleUserDTO> toSimpleDTOList(@NotNull List<User> users) {
        return users.stream()
                .map(this::toSimpleDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<SimpleDoctorDTO> toSimpleDoctorDTOList(@NotNull List<User> users) {
        return users.stream()
                .map(this::toSimpleDoctorDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<User> toListEntity(@NotNull List<UserDTO> userDTOS) {
        return userDTOS.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}