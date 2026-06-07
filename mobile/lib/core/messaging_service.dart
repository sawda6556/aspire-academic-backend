import 'dart:convert';
import 'package:http/http.dart' as http;
import 'constants.dart';

class MessagingService {
  final String _baseUrl = AppConstants.baseUrl;

  Future<List<dynamic>> getConversations(String token) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/messages/conversations'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load conversations');
    }
  }

  Future<List<dynamic>> getChatHistory(String token, String otherUserId) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/messages/$otherUserId'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load chat history');
    }
  }
}
