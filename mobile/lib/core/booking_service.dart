import 'dart:convert';
import 'package:http/http.dart' as http;
import 'constants.dart';

class BookingService {
  final String _baseUrl = AppConstants.baseUrl;

  Future<List<dynamic>> getMyBookings(String token) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/bookings/my-bookings'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load bookings');
    }
  }

  Future<Map<String, dynamic>> createBooking(String token, Map<String, dynamic> bookingData) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/bookings'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(bookingData),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      final error = jsonDecode(response.body);
      throw Exception(error['message'] ?? 'Failed to create booking');
    }
  }
}
