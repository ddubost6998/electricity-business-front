import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {jwtDecode, JwtPayload} from 'jwt-decode';

const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.getToken();

    if (!token) {
        router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }

    try {
        const decoded = jwtDecode<JwtPayload & { exp: number }>(token);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp < now) {
            authService.logout(); // Supprime le token expiré
            router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }

        return true; // Token valide, accès autorisé
    } catch (error) {
        console.error('Invalid token:', error);
        authService.logout();
        router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }
};
export default authGuard
