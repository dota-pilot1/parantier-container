package com.mapo.palantier.menu.application;

import com.mapo.palantier.menu.domain.Menu;
import com.mapo.palantier.menu.domain.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {
    private final MenuRepository menuRepository;

    public List<Menu> getMenusByRole(String role) {
        return menuRepository.findAllByRole(role);
    }

    public List<Menu> getMenuTreeByRole(String role) {
        return menuRepository.findMenuTreeByRole(role);
    }

    public List<Menu> getChildMenus(Long parentId, String role) {
        return menuRepository.findChildMenus(parentId, role);
    }

    public Menu getMenuById(Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu not found: " + id));
    }

    @Transactional
    public Menu createMenu(Menu menu) {
        menuRepository.save(menu);
        return menu;
    }

    @Transactional
    public Menu updateMenu(Menu menu) {
        menuRepository.update(menu);
        return menu;
    }

    @Transactional
    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
}
