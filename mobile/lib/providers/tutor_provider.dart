import 'package:flutter/material.dart';
import '../models/tutor.dart';
import '../core/tutor_api_service.dart';

class TutorProvider with ChangeNotifier {
  final TutorApiService _apiService = TutorApiService();
  
  List<Tutor> _tutors = [];
  bool _isLoading = false;
  String? _error;

  List<Tutor> get tutors => _tutors;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadTutors({
    String? subject,
    double? minPrice,
    double? maxPrice,
    double? minRating,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _tutors = await _apiService.fetchTutors(
        subject: subject,
        minPrice: minPrice,
        maxPrice: maxPrice,
        minRating: minRating,
      );
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Tutor?> getTutorById(String id) async {
    try {
      return await _apiService.fetchTutorById(id);
    } catch (e) {
      _error = e.toString();
      return null;
    }
  }
}
