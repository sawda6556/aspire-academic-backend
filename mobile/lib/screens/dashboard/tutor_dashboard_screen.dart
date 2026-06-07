import 'package:flutter/material.dart';

class TutorDashboardScreen extends StatelessWidget {
  const TutorDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Tutor Dashboard',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF2D3748)),
          ),
          const SizedBox(height: 20),
          
          // Stats Row
          Row(
            children: [
              _buildStatCard('Total Earnings', '$1,240', Icons.payments_outlined, Colors.green),
              const SizedBox(width: 16),
              _buildStatCard('Active Students', '12', Icons.people_outline, Colors.blue),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _buildStatCard('Lessons Done', '45', Icons.check_circle_outline, Colors.teal),
              const SizedBox(width: 16),
              _buildStatCard('Average Rating', '4.9', Icons.star_outline, Colors.orange),
            ],
          ),
          
          const SizedBox(height: 32),
          const Text(
            'Upcoming Lessons',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          
          _buildLessonCard('Mathematics', 'Ahmad Jr.', 'Today, 2:00 PM', true),
          _buildLessonCard('Physics', 'Sara M.', 'Tomorrow, 10:00 AM', false),
          
          const SizedBox(height: 32),
          const Text(
            'Profile Status',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE8ECF1)),
            ),
            child: Row(
              children: [
                const Icon(Icons.verified, color: Color(0xFFC9A962)),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'Your profile is currently under review.',
                    style: TextStyle(fontWeight: FontWeight.w500),
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text('View Details'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 12),
            Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
          ],
        ),
      ),
    );
  }

  Widget _buildLessonCard(String subject, String student, String time, bool isToday) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isToday ? const Color(0xFF2B4C7E).withOpacity(0.05) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isToday ? const Color(0xFF2B4C7E) : const Color(0xFFE8ECF1)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: const Color(0xFFE8ECF1),
            child: Text(student[0]),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(subject, style: const TextStyle(fontWeight: FontWeight.bold)),
                Text('Student: $student', style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(time, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
              if (isToday)
                const Text('Join Now', style: TextStyle(color: Color(0xFF4BA3A3), fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }
}
