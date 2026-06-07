import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'marketplace/tutor_marketplace_screen.dart';
import 'dashboard/tutor_dashboard_screen.dart';
import 'dashboard/parent_dashboard_screen.dart';
import 'dashboard/student_dashboard_screen.dart';
import 'onboarding/tutor_verification_screen.dart';

import '../providers/messaging_provider.dart';
import '../core/constants.dart';

import 'messaging/messaging_screen.dart';
import 'booking/my_bookings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _setupSocket();
    });
  }

  void _setupSocket() {
    final authProvider = context.read<AuthProvider>();
    if (authProvider.isAuthenticated) {
      context.read<MessagingProvider>().connect(
        authProvider.token!,
        AppConstants.baseUrl,
      );
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _showDeleteAccountDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Account?'),
        content: const Text(
          'This action is permanent and will delete all your data, including lessons and purchases.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              await context.read<AuthProvider>().deleteAccount();
              if (mounted) {
                Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
              }
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete Permanently'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final user = authProvider.user;

    if (!authProvider.isAuthenticated) {
      Future.microtask(() => Navigator.pushReplacementNamed(context, '/login'));
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final String userType = user?['user_type'] ?? 'STUDENT';
    
    // Define navigation items based on user type
    List<BottomNavigationBarItem> navItems = [];
    List<Widget> screens = [];

    if (userType == 'TUTOR') {
      navItems = const [
        BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
        BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), label: 'Messaging'),
        BottomNavigationBarItem(icon: Icon(Icons.calendar_today_outlined), label: 'Schedule'),
        BottomNavigationBarItem(icon: Icon(Icons.storefront_outlined), label: 'My Store'),
      ];
      screens = [
        const TutorDashboardScreen(),
        const MessagingScreen(),
        const MyBookingsScreen(),
        const _Placeholder('Store Management'),
      ];
    } else if (userType == 'PARENT') {
      navItems = const [
        BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
        BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Marketplace'),
        BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), label: 'Messaging'),
        BottomNavigationBarItem(icon: Icon(Icons.storefront_outlined), label: 'Store'),
      ];
      screens = [
        const ParentDashboardScreen(),
        const TutorMarketplaceScreen(),
        const MessagingScreen(),
        const _Placeholder('Educational Store'),
      ];
    } else {
      // STUDENT
      navItems = const [
        BottomNavigationBarItem(icon: Icon(Icons.school_outlined), label: 'My Learning'),
        BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Marketplace'),
        BottomNavigationBarItem(icon: Icon(Icons.chat_bubble_outline), label: 'Messaging'),
        BottomNavigationBarItem(icon: Icon(Icons.storefront_outlined), label: 'Store'),
      ];
      screens = [
        const StudentDashboardScreen(),
        const TutorMarketplaceScreen(),
        const MessagingScreen(),
        const _Placeholder('Educational Store'),
      ];
    }

    String? fullName;
    if (userType == 'TUTOR') {
      fullName = user?['tutor_profile']?['full_name'];
    } else if (userType == 'PARENT') {
      fullName = user?['parent_profile']?['full_name'];
    } else {
      fullName = user?['student_profile']?['full_name'];
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Aspire Academic'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: CircleAvatar(
              backgroundColor: const Color(0xFFE8ECF1),
              backgroundImage: AssetImage(authProvider.avatarUrl),
            ),
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              decoration: const BoxDecoration(color: Color(0xFF2B4C7E)),
              accountName: Text(fullName ?? 'User'),
              accountEmail: Text(user?['email'] ?? ''),
              currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.white,
                backgroundImage: AssetImage(authProvider.avatarUrl),
              ),
            ),
            if (userType == 'TUTOR')
              ListTile(
                leading: const Icon(Icons.verified_user_outlined),
                title: const Text('Verification Status'),
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => const TutorVerificationScreen()));
                },
              ),
            ListTile(
              leading: const Icon(Icons.person_outline),
              title: const Text('Profile Settings'),
              onTap: () {},
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () {
                context.read<AuthProvider>().logout();
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete_forever, color: Colors.red),
              title: const Text('Delete Account', style: TextStyle(color: Colors.red)),
              onTap: () {
                Navigator.pop(context);
                _showDeleteAccountDialog();
              },
            ),
          ],
        ),
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: navItems,
        currentIndex: _selectedIndex,
        selectedItemColor: const Color(0xFF2B4C7E),
        unselectedItemColor: const Color(0xFF6B7280),
        onTap: _onItemTapped,
      ),
    );
  }
}

class _Placeholder extends StatelessWidget {
  final String title;
  const _Placeholder(this.title);
  @override
  Widget build(BuildContext context) {
    return Center(child: Text('$title - Coming Soon'));
  }
}
