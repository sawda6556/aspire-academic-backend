import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/tutor_provider.dart';
import '../../widgets/tutor_card.dart';
import '../../core/constants.dart';
import 'tutor_profile_screen.dart';

class TutorMarketplaceScreen extends StatefulWidget {
  const TutorMarketplaceScreen({super.key});

  @override
  State<TutorMarketplaceScreen> createState() => _TutorMarketplaceScreenState();
}

class _TutorMarketplaceScreenState extends State<TutorMarketplaceScreen> {
  final TextEditingController _searchController = TextEditingController();
  String? _selectedSubject;
  double? _maxPrice;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<TutorProvider>().loadTutors();
    });
  }

  void _showFilterModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => _FilterModal(
        initialSubject: _selectedSubject,
        initialMaxPrice: _maxPrice,
        onApply: (subject, maxPrice) {
          setState(() {
            _selectedSubject = subject;
            _maxPrice = maxPrice;
          });
          context.read<TutorProvider>().loadTutors(
            subject: _selectedSubject,
            maxPrice: _maxPrice,
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Find a Tutor'),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune),
            onPressed: _showFilterModal,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search by name or subject...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
              onChanged: (value) {
                // Local search or API call
              },
            ),
          ),
          
          // Active Filters
          if (_selectedSubject != null || _maxPrice != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Wrap(
                spacing: 8,
                children: [
                  if (_selectedSubject != null)
                    Chip(
                      label: Text(_selectedSubject!),
                      onDeleted: () {
                        setState(() => _selectedSubject = null);
                        context.read<TutorProvider>().loadTutors(maxPrice: _maxPrice);
                      },
                    ),
                  if (_maxPrice != null)
                    Chip(
                      label: Text('Max \$$_maxPrice/hr'),
                      onDeleted: () {
                        setState(() => _maxPrice = null);
                        context.read<TutorProvider>().loadTutors(subject: _selectedSubject);
                      },
                    ),
                ],
              ),
            ),

          // Tutor List
          Expanded(
            child: Consumer<TutorProvider>(
              builder: (context, provider, child) {
                if (provider.isLoading) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (provider.error != null) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline, size: 64, color: AppColors.textMuted),
                        const SizedBox(height: 16),
                        Text(provider.error!),
                        ElevatedButton(
                          onPressed: () => provider.loadTutors(),
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  );
                }

                if (provider.tutors.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.search_off, size: 64, color: AppColors.textMuted),
                        SizedBox(height: 16),
                        Text('No tutors found match your criteria.'),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: provider.tutors.length,
                  itemBuilder: (context, index) {
                    final tutor = provider.tutors[index];
                    return TutorCard(
                      tutor: tutor,
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => TutorProfileScreen(tutor: tutor),
                          ),
                        );
                      },
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterModal extends StatefulWidget {
  final String? initialSubject;
  final double? initialMaxPrice;
  final Function(String?, double?) onApply;

  const _FilterModal({
    this.initialSubject,
    this.initialMaxPrice,
    required this.onApply,
  });

  @override
  State<_FilterModal> createState() => _FilterModalState();
}

class _FilterModalState extends State<_FilterModal> {
  String? _subject;
  double _price = 100;

  @override
  void initState() {
    super.initState();
    _subject = widget.initialSubject;
    _price = widget.initialMaxPrice ?? 100;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(24, 24, 24, MediaQuery.of(context).padding.bottom + 24),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Filter Tutors',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          const Text('Subject', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            value: _subject,
            decoration: InputDecoration(
              filled: true,
              fillColor: AppColors.surface,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            ),
            items: ['Mathematics', 'Science', 'English', 'Arabic', 'Quran Studies', 'Islamic Studies']
                .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                .toList(),
            onChanged: (val) => setState(() => _subject = val),
            hint: const Text('Select a subject'),
          ),
          const SizedBox(height: 24),
          Text('Max Price: \$${_price.toInt()}/hr', style: const TextStyle(fontWeight: FontWeight.bold)),
          Slider(
            value: _price,
            min: 10,
            max: 200,
            divisions: 19,
            activeColor: AppColors.primary,
            onChanged: (val) => setState(() => _price = val),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                widget.onApply(_subject, _price);
                Navigator.pop(context);
              },
              child: const Text('Apply Filters', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}
