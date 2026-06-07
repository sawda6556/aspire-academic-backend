class Tutor {
  final String id;
  final String userId;
  final String fullName;
  final String country;
  final String bio;
  final double hourlyRate;
  final List<String> subjects;
  final List<String> languages;
  final String qualifications;
  final String experience;
  final String verificationStatus;
  final String? idDocumentUrl;
  final String? certDocumentUrl;
  final DateTime? verifiedAt;
  final String gender;
  final double rating;
  final int reviewCount;

  Tutor({
    required this.id,
    required this.userId,
    required this.fullName,
    required this.country,
    required this.bio,
    required this.hourlyRate,
    required this.subjects,
    required this.languages,
    required this.qualifications,
    required this.experience,
    required this.verificationStatus,
    this.idDocumentUrl,
    this.certDocumentUrl,
    this.verifiedAt,
    required this.gender,
    this.rating = 0.0,
    this.reviewCount = 0,
  });

  factory Tutor.fromJson(Map<String, dynamic> json) {
    return Tutor(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      fullName: json['full_name'] ?? '',
      country: json['country'] ?? '',
      bio: json['bio'] ?? '',
      hourlyRate: (json['hourly_rate'] ?? 0).toDouble(),
      subjects: List<String>.from(json['subjects'] ?? []),
      languages: List<String>.from(json['languages'] ?? []),
      qualifications: json['qualifications'] ?? '',
      experience: json['experience'] ?? '',
      verificationStatus: json['verification_status'] ?? 'PENDING',
      idDocumentUrl: json['id_document_url'],
      certDocumentUrl: json['cert_document_url'],
      verifiedAt: json['verified_at'] != null 
          ? DateTime.parse(json['verified_at']) 
          : null,
      gender: json['user']?['gender'] ?? 'MALE',
      rating: (json['rating'] ?? 0).toDouble(),
      reviewCount: json['review_count'] ?? 0,
    );
  }

  String get avatarAsset {
    return gender.toUpperCase() == 'FEMALE'
        ? 'assets/avatars/female-avatar-hijab.png'
        : 'assets/avatars/male-avatar.png';
  }
}
