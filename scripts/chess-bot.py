import random
import math
from typing import List, Tuple, Dict, Optional, Any

class AdvancedChessBot:
    """
    Advanced Chess Bot using minimax with alpha-beta pruning,
    iterative deepening, and sophisticated evaluation functions.
    """
    
    def __init__(self):
        self.piece_values = {
            'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000,
            'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000
        }
        
        # Positional tables for piece-square evaluation
        self.pawn_table = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]
        ]
        
        self.knight_table = [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]
        ]
        
        self.bishop_table = [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]
        ]
        
        self.rook_table = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10, 10, 10, 10, 10,  5],
            [-5, 0,  0,  0,  0,  0,  0, -5],
            [-5, 0,  0,  0,  0,  0,  0, -5],
            [-5, 0,  0,  0,  0,  0,  0, -5],
            [-5, 0,  0,  0,  0,  0,  0, -5],
            [-5, 0,  0,  0,  0,  0,  0, -5],
            [0,  0,  0,  5,  5,  0,  0,  0]
        ]
        
        self.queen_table = [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [-5,   0,  5,  5,  5,  5,  0, -5],
            [0,    0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]
        ]
        
        self.king_middle_game = [
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [20, 20,  0,  0,  0,  0, 20, 20],
            [20, 30, 10,  0,  0, 10, 30, 20]
        ]
        
        self.king_end_game = [
            [-50,-40,-30,-20,-20,-30,-40,-50],
            [-30,-20,-10,  0,  0,-10,-20,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 30, 40, 40, 30,-10,-30],
            [-30,-10, 20, 30, 30, 20,-10,-30],
            [-30,-30,  0,  0,  0,  0,-30,-30],
            [-50,-30,-30,-30,-30,-30,-30,-50]
        ]
        
        self.transposition_table = {}
        self.killer_moves = {}
        self.history_table = {}
        
    def evaluate_position(self, board: List[List], game_state: Dict) -> float:
        """Advanced position evaluation with multiple factors"""
        score = 0
        white_pieces = 0
        black_pieces = 0
        
        # Material and positional evaluation
        for row in range(8):
            for col in range(8):
                piece = board[row][col]
                if piece:
                    piece_value = self.piece_values[piece]
                    positional_value = self.get_positional_value(piece, row, col, board)
                    
                    if piece.isupper():
                        white_pieces += 1
                        score += piece_value + positional_value
                    else:
                        black_pieces += 1
                        score -= piece_value + positional_value
        
        # Endgame detection
        total_pieces = white_pieces + black_pieces
        is_endgame = total_pieces <= 10
        
        # Additional evaluation factors
        score += self.evaluate_mobility(board, True) - self.evaluate_mobility(board, False)
        score += self.evaluate_king_safety(board, True, is_endgame) - self.evaluate_king_safety(board, False, is_endgame)
        score += self.evaluate_pawn_structure(board, True) - self.evaluate_pawn_structure(board, False)
        score += self.evaluate_center_control(board, True) - self.evaluate_center_control(board, False)
        
        return score
    
    def get_positional_value(self, piece: str, row: int, col: int, board: List[List]) -> float:
        """Get positional value for a piece based on its position"""
        piece_type = piece.lower()
        is_white = piece.isupper()
        
        # Flip table for black pieces
        table_row = row if is_white else 7 - row
        
        if piece_type == 'p':
            return self.pawn_table[table_row][col]
        elif piece_type == 'n':
            return self.knight_table[table_row][col]
        elif piece_type == 'b':
            return self.bishop_table[table_row][col]
        elif piece_type == 'r':
            return self.rook_table[table_row][col]
        elif piece_type == 'q':
            return self.queen_table[table_row][col]
        elif piece_type == 'k':
            # Use endgame table if few pieces remain
            total_pieces = sum(1 for row in board for piece in row if piece)
            if total_pieces <= 10:
                return self.king_end_game[table_row][col]
            else:
                return self.king_middle_game[table_row][col]
        
        return 0
    
    def evaluate_mobility(self, board: List[List], is_white: bool) -> float:
        """Evaluate piece mobility (number of legal moves)"""
        mobility = 0
        for row in range(8):
            for col in range(8):
                piece = board[row][col]
                if piece and ((is_white and piece.isupper()) or (not is_white and piece.islower())):
                    moves = self.get_piece_moves(board, row, col, piece)
                    mobility += len(moves) * 2
        return mobility
    
    def evaluate_king_safety(self, board: List[List], is_white: bool, is_endgame: bool) -> float:
        """Evaluate king safety"""
        king_pos = self.find_king(board, is_white)
        if not king_pos:
            return -10000
        
        safety = 0
        king_row, king_col = king_pos
        
        if not is_endgame:
            # Penalty for exposed king in middle game
            for dr in [-1, 0, 1]:
                for dc in [-1, 0, 1]:
                    if dr == 0 and dc == 0:
                        continue
                    new_row, new_col = king_row + dr, king_col + dc
                    if 0 <= new_row < 8 and 0 <= new_col < 8:
                        if not board[new_row][new_col]:
                            safety -= 10  # Penalty for empty squares around king
        else:
            # In endgame, king should be active
            center_distance = abs(king_row - 3.5) + abs(king_col - 3.5)
            safety -= center_distance * 5
        
        return safety
    
    def evaluate_pawn_structure(self, board: List[List], is_white: bool) -> float:
        """Evaluate pawn structure (doubled, isolated, passed pawns)"""
        score = 0
        pawn_files = [0] * 8
        
        # Count pawns per file
        for row in range(8):
            for col in range(8):
                piece = board[row][col]
                if piece and piece.lower() == 'p':
                    if (is_white and piece.isupper()) or (not is_white and piece.islower()):
                        pawn_files[col] += 1
        
        # Evaluate pawn structure
        for col in range(8):
            if pawn_files[col] > 1:
                score -= 20 * (pawn_files[col] - 1)  # Doubled pawns penalty
            
            if pawn_files[col] > 0:
                # Check for isolated pawns
                isolated = True
                for adjacent_col in [col - 1, col + 1]:
                    if 0 <= adjacent_col < 8 and pawn_files[adjacent_col] > 0:
                        isolated = False
                        break
                if isolated:
                    score -= 15  # Isolated pawn penalty
        
        return score
    
    def evaluate_center_control(self, board: List[List], is_white: bool) -> float:
        """Evaluate control of center squares"""
        center_squares = [(3, 3), (3, 4), (4, 3), (4, 4)]
        extended_center = [(2, 2), (2, 3), (2, 4), (2, 5), (3, 2), (3, 5), (4, 2), (4, 5), (5, 2), (5, 3), (5, 4), (5, 5)]
        
        score = 0
        
        for row, col in center_squares:
            piece = board[row][col]
            if piece:
                if (is_white and piece.isupper()) or (not is_white and piece.islower()):
                    score += 20
            
            # Check if square is attacked
            if self.is_square_attacked(board, (row, col), is_white):
                score += 10
        
        for row, col in extended_center:
            if self.is_square_attacked(board, (row, col), is_white):
                score += 5
        
        return score
    
    def minimax_alpha_beta(self, board: List[List], depth: int, alpha: float, beta: float, 
                          maximizing: bool, game_state: Dict) -> Tuple[float, Optional[Dict]]:
        """Minimax with alpha-beta pruning"""
        if depth == 0:
            return self.evaluate_position(board, game_state), None
        
        moves = self.get_all_moves(board, maximizing, game_state)
        if not moves:
            if self.is_in_check(board, maximizing):
                return (-10000 if maximizing else 10000), None
            else:
                return 0, None  # Stalemate
        
        # Move ordering for better pruning
        moves = self.order_moves(moves, board, depth)
        
        best_move = None
        
        if maximizing:
            max_eval = float('-inf')
            for move in moves:
                new_board, new_game_state = self.make_move_copy(board, move['from'], move['to'], game_state)
                eval_score, _ = self.minimax_alpha_beta(new_board, depth - 1, alpha, beta, False, new_game_state)
                
                if eval_score > max_eval:
                    max_eval = eval_score
                    best_move = move
                
                alpha = max(alpha, eval_score)
                if beta <= alpha:
                    break  # Alpha-beta pruning
            
            return max_eval, best_move
        else:
            min_eval = float('inf')
            for move in moves:
                new_board, new_game_state = self.make_move_copy(board, move['from'], move['to'], game_state)
                eval_score, _ = self.minimax_alpha_beta(new_board, depth - 1, alpha, beta, True, new_game_state)
                
                if eval_score < min_eval:
                    min_eval = eval_score
                    best_move = move
                
                beta = min(beta, eval_score)
                if beta <= alpha:
                    break  # Alpha-beta pruning
            
            return min_eval, best_move
    
    def order_moves(self, moves: List[Dict], board: List[List], depth: int) -> List[Dict]:
        """Order moves for better alpha-beta pruning"""
        def move_score(move):
            score = 0
            from_row, from_col = move['from']
            to_row, to_col = move['to']
            
            # Prioritize captures
            target = board[to_row][to_col]
            if target:
                moving_piece = board[from_row][from_col]
                score += self.piece_values[target] - self.piece_values[moving_piece]
            
            # Prioritize center moves
            center_distance = abs(to_row - 3.5) + abs(to_col - 3.5)
            score -= center_distance
            
            # Prioritize killer moves
            move_key = f"{move['from']}-{move['to']}"
            if move_key in self.killer_moves.get(depth, {}):
                score += 100
            
            return score
        
        return sorted(moves, key=move_score, reverse=True)
    
    def get_best_move(self, board: List[List], depth: int, game_state: Dict) -> Optional[Dict]:
        """Get the best move using iterative deepening"""
        best_move = None
        
        # Iterative deepening
        for current_depth in range(1, depth + 1):
            try:
                _, move = self.minimax_alpha_beta(board, current_depth, float('-inf'), float('inf'), False, game_state)
                if move:
                    best_move = move
            except:
                break
        
        return best_move
    
    def get_all_moves(self, board: List[List], is_white: bool, game_state: Dict) -> List[Dict]:
        """Get all legal moves for a player"""
        moves = []
        for row in range(8):
            for col in range(8):
                piece = board[row][col]
                if piece and ((is_white and piece.isupper()) or (not is_white and piece.islower())):
                    piece_moves = self.get_piece_moves(board, row, col, piece, game_state)
                    for move in piece_moves:
                        move_to = move if isinstance(move, list) else move.get('to', move)
                        if self.is_valid_move(board, [row, col], move_to, is_white, game_state):
                            moves.append({
                                'from': [row, col],
                                'to': move_to,
                                'piece': piece,
                                'special': move.get('special') if isinstance(move, dict) else None
                            })
        return moves
    
    def get_piece_moves(self, board: List[List], row: int, col: int, piece: str, game_state: Dict = None) -> List:
        """Get all possible moves for a piece"""
        piece_type = piece.lower()
        is_white = piece.isupper()
        
        if piece_type == 'p':
            return self.get_pawn_moves(board, row, col, is_white, game_state or {})
        elif piece_type == 'r':
            return self.get_rook_moves(board, row, col, is_white)
        elif piece_type == 'n':
            return self.get_knight_moves(board, row, col, is_white)
        elif piece_type == 'b':
            return self.get_bishop_moves(board, row, col, is_white)
        elif piece_type == 'q':
            return self.get_queen_moves(board, row, col, is_white)
        elif piece_type == 'k':
            return self.get_king_moves(board, row, col, is_white, game_state or {})
        
        return []
    
    def get_pawn_moves(self, board: List[List], row: int, col: int, is_white: bool, game_state: Dict) -> List:
        """Get pawn moves including promotion and en passant"""
        moves = []
        direction = -1 if is_white else 1
        start_row = 6 if is_white else 1
        promotion_row = 0 if is_white else 7
        
        # Forward moves
        if 0 <= row + direction < 8 and not board[row + direction][col]:
            new_row = row + direction
            if new_row == promotion_row:
                # Pawn promotion
                for promote_to in ['q', 'r', 'b', 'n']:
                    moves.append({
                        'to': [new_row, col],
                        'special': {'type': 'promotion', 'promoteTo': promote_to.upper() if is_white else promote_to}
                    })
            else:
                moves.append([new_row, col])
                # Double move from starting position
                if row == start_row and not board[row + 2 * direction][col]:
                    moves.append({
                        'to': [row + 2 * direction, col],
                        'special': {'type': 'enPassantTarget', 'target': [row + direction, col]}
                    })
        
        # Captures
        for dcol in [-1, 1]:
            new_row, new_col = row + direction, col + dcol
            if 0 <= new_row < 8 and 0 <= new_col < 8:
                target = board[new_row][new_col]
                if target and ((is_white and target.islower()) or (not is_white and target.isupper())):
                    if new_row == promotion_row:
                        # Capture with promotion
                        for promote_to in ['q', 'r', 'b', 'n']:
                            moves.append({
                                'to': [new_row, new_col],
                                'special': {'type': 'promotion', 'promoteTo': promote_to.upper() if is_white else promote_to}
                            })
                    else:
                        moves.append([new_row, new_col])
                # En passant
                elif (game_state.get('enPassantTarget') and 
                      game_state['enPassantTarget'][0] == new_row and 
                      game_state['enPassantTarget'][1] == new_col):
                    moves.append({
                        'to': [new_row, new_col],
                        'special': {'type': 'enPassant', 'captureSquare': [row, new_col]}
                    })
        
        return moves
    
    def get_rook_moves(self, board: List[List], row: int, col: int, is_white: bool) -> List:
        """Get rook moves"""
        moves = []
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        
        for dr, dc in directions:
            for i in range(1, 8):
                new_row, new_col = row + dr * i, col + dc * i
                if not (0 <= new_row < 8 and 0 <= new_col < 8):
                    break
                
                target = board[new_row][new_col]
                if not target:
                    moves.append([new_row, new_col])
                elif (is_white and target.islower()) or (not is_white and target.isupper()):
                    moves.append([new_row, new_col])
                    break
                else:
                    break
        
        return moves
    
    def get_knight_moves(self, board: List[List], row: int, col: int, is_white: bool) -> List:
        """Get knight moves"""
        moves = []
        knight_moves = [(-2, -1), (-2, 1), (-1, -2), (-1, 2), (1, -2), (1, 2), (2, -1), (2, 1)]
        
        for dr, dc in knight_moves:
            new_row, new_col = row + dr, col + dc
            if 0 <= new_row < 8 and 0 <= new_col < 8:
                target = board[new_row][new_col]
                if not target or ((is_white and target.islower()) or (not is_white and target.isupper())):
                    moves.append([new_row, new_col])
        
        return moves
    
    def get_bishop_moves(self, board: List[List], row: int, col: int, is_white: bool) -> List:
        """Get bishop moves"""
        moves = []
        directions = [(1, 1), (1, -1), (-1, 1), (-1, -1)]
        
        for dr, dc in directions:
            for i in range(1, 8):
                new_row, new_col = row + dr * i, col + dc * i
                if not (0 <= new_row < 8 and 0 <= new_col < 8):
                    break
                
                target = board[new_row][new_col]
                if not target:
                    moves.append([new_row, new_col])
                elif (is_white and target.islower()) or (not is_white and target.isupper()):
                    moves.append([new_row, new_col])
                    break
                else:
                    break
        
        return moves
    
    def get_queen_moves(self, board: List[List], row: int, col: int, is_white: bool) -> List:
        """Get queen moves (combination of rook and bishop)"""
        return self.get_rook_moves(board, row, col, is_white) + self.get_bishop_moves(board, row, col, is_white)
    
    def get_king_moves(self, board: List[List], row: int, col: int, is_white: bool, game_state: Dict) -> List:
        """Get king moves including castling"""
        moves = []
        king_moves = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
        
        for dr, dc in king_moves:
            new_row, new_col = row + dr, col + dc
            if 0 <= new_row < 8 and 0 <= new_col < 8:
                target = board[new_row][new_col]
                if not target or ((is_white and target.islower()) or (not is_white and target.isupper())):
                    moves.append([new_row, new_col])
        
        # Castling
        if not self.is_in_check(board, is_white):
            castling_rights = game_state.get('castlingRights', {})
            
            if is_white:
                # White kingside castling
                if (castling_rights.get('whiteKing') and not board[7][5] and not board[7][6] and 
                    board[7][7] == 'R' and not self.is_square_attacked(board, (7, 5), False) and 
                    not self.is_square_attacked(board, (7, 6), False)):
                    moves.append({
                        'to': [7, 6],
                        'special': {'type': 'castle', 'rookFrom': [7, 7], 'rookTo': [7, 5]}
                    })
                
                # White queenside castling
                if (castling_rights.get('whiteQueen') and not board[7][1] and not board[7][2] and 
                    not board[7][3] and board[7][0] == 'R' and not self.is_square_attacked(board, (7, 2), False) and 
                    not self.is_square_attacked(board, (7, 3), False)):
                    moves.append({
                        'to': [7, 2],
                        'special': {'type': 'castle', 'rookFrom': [7, 0], 'rookTo': [7, 3]}
                    })
            else:
                # Black kingside castling
                if (castling_rights.get('blackKing') and not board[0][5] and not board[0][6] and 
                    board[0][7] == 'r' and not self.is_square_attacked(board, (0, 5), True) and 
                    not self.is_square_attacked(board, (0, 6), True)):
                    moves.append({
                        'to': [0, 6],
                        'special': {'type': 'castle', 'rookFrom': [0, 7], 'rookTo': [0, 5]}
                    })
                
                # Black queenside castling
                if (castling_rights.get('blackQueen') and not board[0][1] and not board[0][2] and 
                    not board[0][3] and board[0][0] == 'r' and not self.is_square_attacked(board, (0, 2), True) and 
                    not self.is_square_attacked(board, (0, 3), True)):
                    moves.append({
                        'to': [0, 2],
                        'special': {'type': 'castle', 'rookFrom': [0, 0], 'rookTo': [0, 3]}
                    })
        
        return moves
    
    def is_square_attacked(self, board: List[List], square: Tuple[int, int], by_white: bool) -> bool:
        """Check if a square is attacked by the specified color"""
        target_row, target_col = square
        
        for row in range(8):
            for col in range(8):
                piece = board[row][col]
                if piece and ((by_white and piece.isupper()) or (not by_white and piece.islower())):
                    moves = self.get_piece_moves(board, row, col, piece, {})
                    for move in moves:
                        move_square = move if isinstance(move, list) else move.get('to', move)
                        if isinstance(move_square, list) and move_square[0] == target_row and move_square[1] == target_col:
                            return True
        return False
    
    def find_king(self, board: List[List], is_white: bool) -> Optional[Tuple[int, int]]:
        """Find the king position"""
        king = 'K' if is_white else 'k'
        for row in range(8):
            for col in range(8):
                if board[row][col] == king:
                    return (row, col)
        return None
    
    def is_in_check(self, board: List[List], is_white: bool) -> bool:
        """Check if the king is in check"""
        king_pos = self.find_king(board, is_white)
        if not king_pos:
            return False
        return self.is_square_attacked(board, king_pos, not is_white)
    
    def is_valid_move(self, board: List[List], from_pos: List[int], to_pos: List[int], 
                     is_white: bool, game_state: Dict) -> bool:
        """Check if a move is valid (doesn't leave king in check)"""
        test_board, _ = self.make_move_copy(board, from_pos, to_pos, game_state)
        return not self.is_in_check(test_board, is_white)
    
    def make_move_copy(self, board: List[List], from_pos: List[int], to_pos: List[int], 
                      game_state: Dict) -> Tuple[List[List], Dict]:
        """Make a move on a copy of the board"""
        new_board = [row[:] for row in board]
        new_game_state = game_state.copy()
        
        from_row, from_col = from_pos
        to_row, to_col = to_pos
        piece = new_board[from_row][from_col]
        
        # Make the basic move
        new_board[to_row][to_col] = piece
        new_board[from_row][from_col] = None
        
        # Handle special moves (castling, en passant, promotion)
        # This is a simplified version - full implementation would handle all special cases
        
        return new_board, new_game_state

# Global bot instance
chess_bot = AdvancedChessBot()

def get_best_move(board, depth, game_state):
    """Main function called from JavaScript"""
    return chess_bot.get_best_move(board, depth, game_state)
