import 'package:flutter/material.dart';

class StudentDashboardScreen extends StatelessWidget {
  const StudentDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'My Learning',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF2D3748)),
          ),
          const SizedBox(height: 20),
          
          const Text(
            'Continue Learning',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          
          _buildProgressCard('Advanced Arabic', 'Lesson 4 of 12', 0.35),
          _buildProgressCard('Islamic History', 'Lesson 7 of 10', 0.60),
          
          const SizedBox(height: 32),
          const Text(
            'Upcoming Lessons',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          
          _buildLessonCard('Advanced Arabic', 'Ms. Zainab Y.', 'Today, 5:00 PM', true),
          _buildLessonCard('Mathematics', 'Dr. Salman A.', 'Tomorrow, 3:00 PM', false),
          
          const SizedBox(height: 32),
          const Text(
            'Recent Resources',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          _buildResourceItem('Arabic Grammar Guide', 'PDF Document', Icons.picture_as_pdf),
          _buildResourceItem('Algebra Practice Set', 'Worksheet', Icons.description),
        ],
      ),
    );
  }

  Widget _buildProgressCard(String title, String subtitle, double progress) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE8ECF1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          Text(subtitle, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: const Color(0xFFE8ECF1),
            color: const Color(0xFF4BA3A3),
            minHeight: 8,
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonCard(String subject, String tutor, String time, bool isToday) {
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
          const Icon(Icons.video_camera_front_outlined, color: Color(0xFF2B4C7E)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(subject, style: const TextStyle(fontWeight: FontWeight.bold)),
                Text('Tutor: $tutor', style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
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

  Widget _buildResourceItem(String title, String type, IconData icon) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(color: const Color(0xFFE8ECF1), borderRadius: BorderRadius.circular(8)),
        child: Icon(icon, color: const Color(0xFF2B4C7E)),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
      subtitle: Text(type, style: const TextStyle(fontSize: 12)),
      trailing: const Icon(Icons.download_outlined, color: Color(0xFFC9A962)),
      onTap: () {},
    );
  }
}
