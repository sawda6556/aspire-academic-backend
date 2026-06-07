import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/messaging_provider.dart';
import 'chat_screen.dart';

class MessagingScreen extends StatefulWidget {
  const MessagingScreen({super.key});

  @override
  State<MessagingScreen> createState() => _MessagingScreenState();
}

class _MessagingScreenState extends State<MessagingScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final token = context.read<AuthProvider>().token;
      if (token != null) {
        context.read<MessagingProvider>().fetchConversations(token);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final messagingProvider = context.watch<MessagingProvider>();
    final conversations = messagingProvider.conversations;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
        elevation: 0,
      ),
      body: messagingProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : conversations.isEmpty
              ? _buildEmptyState()
              : ListView.separated(
                  itemCount: conversations.length,
                  separatorBuilder: (context, index) => const Divider(height: 1),
                  itemBuilder: (context, index) {
                    final conv = conversations[index];
                    final otherUser = conv['otherUser'];
                    final lastMessage = conv['lastMessage'];

                    return ListTile(
                      leading: CircleAvatar(
                        backgroundColor: const Color(0xFFE8ECF1),
                        child: Text(otherUser['full_name']?[0] ?? 'U'),
                      ),
                      title: Text(
                        otherUser['full_name'] ?? 'User',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(
                        lastMessage['content'] ?? '',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      trailing: Text(
                        _formatTime(lastMessage['created_at']),
                        style: const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ChatScreen(
                              otherUserId: otherUser['id'],
                              otherUserName: otherUser['full_name'],
                            ),
                          ),
                        );
                      },
                    );
                  },
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.chat_bubble_outline, size: 64, color: Colors.grey[300]),
          const SizedBox(height: 16),
          const Text(
            'No messages yet',
            style: TextStyle(fontSize: 18, color: Colors.grey),
          ),
          const SizedBox(height: 8),
          const Text(
            'Find a tutor to start a conversation.',
            style: TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }

  String _formatTime(String? timestamp) {
    if (timestamp == null) return '';
    final date = DateTime.parse(timestamp);
    final now = DateTime.now();
    if (date.day == now.day && date.month == now.month && date.year == now.year) {
      return '${date.hour}:${date.minute.toString().padLeft(2, '0')}';
    }
    return '${date.day}/${date.month}';
  }
}
