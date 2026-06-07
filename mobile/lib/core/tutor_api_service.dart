import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants.dart';
import '../models/tutor.dart';

class TutorApiService {
  final String _baseUrl = AppConstants.baseUrl;

  Future<List<Tutor>> fetchTutors({
    String? subject,
    double? minPrice,
    double? maxPrice,
    double? minRating,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (subject != null) queryParams['subject'] = subject;
      if (minPrice != null) queryParams['minPrice'] = minPrice.toString();
      if (maxPrice != null) queryParams['maxPrice'] = maxPrice.toString();
      if (minRating != null) queryParams['minRating'] = minRating.toString();

      final uri = Uri.parse('$_baseUrl/tutor-profiles/marketplace').replace(queryParameters: queryParams);
      
      final response = await http.get(
        uri,
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Tutor.fromJson(json)).toList();
      } else {
        throw Exception('Failed to fetch tutors');
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<Tutor> fetchTutorById(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/tutor-profiles/$id'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return Tutor.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to fetch tutor details');
      }
    } catch (e) {
      rethrow;
    }
  }
}
