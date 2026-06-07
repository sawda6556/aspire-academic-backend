import 'package:flutter/material.dart';

class TutorVerificationScreen extends StatefulWidget {
  const TutorVerificationScreen({super.key});

  @override
  State<TutorVerificationScreen> createState() => _TutorVerificationScreenState();
}

class _TutorVerificationScreenState extends State<TutorVerificationScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Become a Verified Tutor')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Verification Process',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            const Text(
              'To ensure the safety and quality of our platform, all tutors must undergo a manual verification process.',
              style: TextStyle(color: Color(0xFF6B7280)),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFE8A598).withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFE8A598)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.privacy_tip_outlined, color: Color(0xFFE8A598), size: 20),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Camera access is for document verification only. No personal profile photos allowed.',
                      style: TextStyle(fontSize: 12, color: Color(0xFF2D3748), fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            _buildUploadCard(
              title: 'Government ID / Passport',
              subtitle: 'Upload a clear photo or PDF of your identity document.',
              icon: Icons.badge_outlined,
            ),
            const SizedBox(height: 16),
            _buildUploadCard(
              title: 'Educational Certificates',
              subtitle: 'Upload your relevant qualifications and degrees.',
              icon: Icons.history_edu_outlined,
            ),
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Verification documents submitted!')),
                );
              },
              child: const Text('Submit for Review'),
            ),
            const SizedBox(height: 20),
            const Text(
              'Our admin team will review your application within 2-3 business days.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUploadCard({required String title, required String subtitle, required IconData icon}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE8ECF1)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFF2B4C7E).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: const Color(0xFF2B4C7E)),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                Text(subtitle, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
              ],
            ),
          ),
          const Icon(Icons.upload_file_outlined, color: Color(0xFFC9A962)),
        ],
      ),
    );
  }
}
