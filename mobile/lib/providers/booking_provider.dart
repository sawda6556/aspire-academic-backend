import 'package:flutter/material.dart';
import '../core/booking_service.dart';

class BookingProvider with ChangeNotifier {
  final BookingService _service = BookingService();
  List<dynamic> _bookings = [];
  bool _isLoading = false;

  List<dynamic> get bookings => _bookings;
  bool get isLoading => _isLoading;

  Future<void> fetchMyBookings(String token) async {
    _isLoading = true;
    notifyListeners();
    try {
      _bookings = await _service.getMyBookings(token);
    } catch (e) {
      print('Error fetching bookings: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<String?> createBooking(String token, Map<String, dynamic> bookingData) async {
    _isLoading = true;
    notifyListeners();
    try {
      final result = await _service.createBooking(token, bookingData);
      // Backend returns checkoutUrl for Stripe
      return result['checkoutUrl'];
    } catch (e) {
      print('Error creating booking: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
