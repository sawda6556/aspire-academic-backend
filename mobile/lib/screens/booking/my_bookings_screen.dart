import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/booking_provider.dart';
import 'package:intl/intl.dart';

class MyBookingsScreen extends StatefulWidget {
  const MyBookingsScreen({super.key});

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token;
      if (token != null) {
        context.read<BookingProvider>().fetchMyBookings(token);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = context.watch<BookingProvider>();
    final bookings = bookingProvider.bookings;
    final userType = context.read<AuthProvider>().user?['user_type'];

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Lessons'),
      ),
      body: bookingProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : bookings.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: bookings.length,
                  itemBuilder: (context, index) {
                    final booking = bookings[index];
                    return _buildBookingCard(booking, userType);
                  },
                ),
    );
  }

  Widget _buildBookingCard(dynamic booking, String? userType) {
    final startTime = DateTime.parse(booking['start_time']);
    final isTutor = userType == 'TUTOR';
    final otherParty = isTutor ? (booking['student']?['full_name'] ?? booking['parent']?['full_name'] ?? 'Student') : booking['tutor']['full_name'];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE8ECF1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF2B4C7E).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.calendar_today, color: Color(0xFF2B4C7E)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isTutor ? 'Lesson with $otherParty' : 'Tutor: $otherParty',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                const SizedBox(height: 4),
                Text(
                  '${DateFormat('EEEE, MMM d').format(startTime)} at ${DateFormat('h:mm a').format(startTime)}',
                  style: const TextStyle(color: Color(0xFF6B7280), fontSize: 13),
                ),
                const SizedBox(height: 8),
                _buildStatusChip(booking['status']),
              ],
            ),
          ),
          if (booking['status'] == 'CONFIRMED')
            IconButton(
              icon: const Icon(Icons.video_call, color: Color(0xFF4BA3A3), size: 30),
              onPressed: () {
                // Join Zoom/Video logic
              },
            ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    switch (status) {
      case 'CONFIRMED':
        color = const Color(0xFF4BA3A3);
        break;
      case 'PENDING':
        color = const Color(0xFFC9A962);
        break;
      case 'CANCELLED':
        color = Colors.red;
        break;
      default:
        color = Colors.grey;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        status,
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.calendar_today_outlined, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text(
            'No bookings found',
            style: TextStyle(fontSize: 18, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
