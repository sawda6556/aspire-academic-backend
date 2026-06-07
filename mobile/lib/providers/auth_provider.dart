import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/api_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  final _storage = const FlutterSecureStorage();
  
  String? _token;
  Map<String, dynamic>? _user;
  bool _isLoading = false;

  String? get token => _token;
  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null;

  AuthProvider() {
    _loadPersistedData();
  }

  Future<void> _loadPersistedData() async {
    _token = await _storage.read(key: 'access_token');
    if (_token != null) {
      try {
        _user = await _authService.getProfile(_token!);
        await _storage.write(key: 'user_data', value: jsonEncode(_user));
      } catch (e) {
        // Token might be invalid or expired
        await logout();
      }
    }
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    try {
      final data = await _authService.login(email, password);
      _token = data['access_token'];
      
      // Fetch full profile after login
      _user = await _authService.getProfile(_token!);
      
      await _storage.write(key: 'access_token', value: _token);
      await _storage.write(key: 'user_data', value: jsonEncode(_user));
      
      notifyListeners();
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signup({
    required String fullName,
    required String email,
    required String password,
    required String userType,
    required String gender,
    Map<String, dynamic>? profileData,
  }) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _authService.signup(
        fullName: fullName,
        email: email,
        password: password,
        userType: userType,
        gender: gender,
        profileData: profileData,
      );
      
      // Auto-login after successful signup
      await login(email, password);
      
    } catch (e) {
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    await _storage.deleteAll();
    notifyListeners();
  }

  Future<void> deleteAccount() async {
    // In a real app, call the backend to delete the account
    // await _authService.deleteAccount(_token!);
    await logout();
  }

  String get avatarUrl {
    if (_user == null) return 'assets/avatars/male-avatar.png';
    final gender = _user!['gender']?.toString().toUpperCase() ?? 'MALE';
    return gender == 'FEMALE' 
        ? 'assets/avatars/female-avatar-hijab.png' 
        : 'assets/avatars/male-avatar.png';
  }
}
