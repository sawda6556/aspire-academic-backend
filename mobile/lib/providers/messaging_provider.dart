import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../core/messaging_service.dart';

class MessagingProvider with ChangeNotifier {
  final MessagingService _service = MessagingService();
  IO.Socket? _socket;
  
  List<dynamic> _conversations = [];
  List<dynamic> _messages = [];
  bool _isLoading = false;
  String? _activeChatUserId;

  List<dynamic> get conversations => _conversations;
  List<dynamic> get messages => _messages;
  bool get isLoading => _isLoading;

  void connect(String token, String baseUrl) {
    if (_socket != null && _socket!.connected) return;

    _socket = IO.io(baseUrl, IO.OptionBuilder()
      .setTransports(['websocket'])
      .setAuth({'token': token})
      .build());

    _socket!.onConnect((_) {
      print('Connected to socket server');
    });

    _socket!.on('newMessage', (data) {
      if (_activeChatUserId == data['sender_id']) {
        _messages.add(data);
        notifyListeners();
      }
      // Refresh conversations list to show latest message
      fetchConversations(token);
    });

    _socket!.onDisconnect((_) => print('Disconnected from socket server'));
  }

  Future<void> fetchConversations(String token) async {
    _isLoading = true;
    notifyListeners();
    try {
      _conversations = await _service.getConversations(token);
    } catch (e) {
      print('Error fetching conversations: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadChatHistory(String token, String otherUserId) async {
    _activeChatUserId = otherUserId;
    _messages = [];
    _isLoading = true;
    notifyListeners();
    try {
      _messages = await _service.getChatHistory(token, otherUserId);
    } catch (e) {
      print('Error loading chat history: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void sendMessage(String receiverId, String content, {String? attachmentUrl}) {
    if (_socket == null || !_socket!.connected) return;

    final messageData = {
      'receiverId': receiverId,
      'content': content,
      'attachmentUrl': attachmentUrl,
    };

    _socket!.emitWithAck('sendMessage', messageData, ack: (data) {
      // The backend returns the saved message in the ack
      _messages.add(data);
      notifyListeners();
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket = null;
  }

  @override
  void dispose() {
    disconnect();
    super.dispose();
  }
}
