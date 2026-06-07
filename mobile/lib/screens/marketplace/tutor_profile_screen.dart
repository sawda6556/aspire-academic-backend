import 'package:flutter/material.dart';
import '../../models/tutor.dart';
import '../../core/constants.dart';

import '../messaging/chat_screen.dart';
import '../booking/booking_screen.dart';

class TutorProfileScreen extends StatelessWidget {
  final Tutor tutor;

  const TutorProfileScreen({super.key, required this.tutor});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Header with Avatar and Background
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                color: AppColors.primary,
                child: Center(
                  child: Container(
                    width: 120,
                    height: 120,
                    margin: const EdgeInsets.only(top: 40),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 4),
                      image: DecorationImage(
                        image: AssetImage(tutor.avatarAsset),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name and Rating
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            tutor.fullName,
                            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                          ),
                          Row(
                            children: [
                              const Icon(Icons.location_on, size: 16, color: AppColors.textMuted),
                              const SizedBox(width: 4),
                              Text(tutor.country, style: const TextStyle(color: AppColors.textMuted)),
                            ],
                          ),
                        ],
                      ),
                      if (tutor.verificationStatus == 'APPROVED')
                        const Chip(
                          backgroundColor: Color(0xFFFEF9C3),
                          label: Text('Verified', style: TextStyle(color: AppColors.secondary, fontWeight: FontWeight.bold)),
                          avatar: Icon(Icons.verified, color: AppColors.secondary, size: 16),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.star, color: Colors.amber, size: 20),
                      const SizedBox(width: 4),
                      Text(
                        tutor.rating.toStringAsFixed(1),
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        ' (${tutor.reviewCount} reviews)',
                        style: const TextStyle(color: AppColors.textMuted),
                      ),
                      const Spacer(),
                      Text(
                        '\$${tutor.hourlyRate.toStringAsFixed(0)}/hr',
                        style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primary),
                      ),
                    ],
                  ),
                  const Divider(height: 48),
                  
                  // Biography
                  const Text('About Me', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(
                    tutor.bio,
                    style: const TextStyle(fontSize: 16, color: AppColors.textMain, height: 1.5),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Subjects
                  const Text('Subjects Taught', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: tutor.subjects.map((s) => _Tag(label: s)).toList(),
                  ),
                  
                  const SizedBox(height: 32),
                  
                  // Qualifications
                  const Text('Qualifications', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(tutor.qualifications, style: const TextStyle(fontSize: 16)),
                  
                  const SizedBox(height: 32),
                  
                  // Experience
                  const Text('Experience', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(tutor.experience, style: const TextStyle(fontSize: 16)),
                  
                  const SizedBox(height: 100), // Spacing for bottom buttons
                ],
              ),
            ),
          ),
        ],
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))],
        ),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  side: const BorderSide(color: AppColors.primary),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ChatScreen(
                        otherUserId: tutor.id,
                        otherUserName: tutor.fullName,
                      ),
                    ),
                  );
                },
                child: const Text('Message', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.secondary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => BookingScreen(tutor: tutor),
                    ),
                  );
                },
                child: const Text('Book Lesson', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Tag extends StatelessWidget {
  final String label;
  const _Tag({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(label, style: const TextStyle(fontSize: 14, color: AppColors.primary)),
    );
  }
}
