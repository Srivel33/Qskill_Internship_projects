from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data received'}), 400

        operation    = data.get('operation', '')
        matrix_a_raw = data.get('matrix_a')
        matrix_b_raw = data.get('matrix_b')

        if not matrix_a_raw:
            return jsonify({'error': 'Matrix A is required'}), 400

        A = np.array(matrix_a_raw, dtype=float)
        if A.ndim != 2 or max(A.shape) > 6:
            return jsonify({'error': 'Matrix A too large (max 6x6)'}), 400

        B = None
        if matrix_b_raw:
            B = np.array(matrix_b_raw, dtype=float)
            if B.ndim != 2 or max(B.shape) > 6:
                return jsonify({'error': 'Matrix B too large (max 6x6)'}), 400

        if operation == 'add':
            if B is None:
                return jsonify({'error': 'Matrix B is required for addition'}), 400
            if A.shape != B.shape:
                return jsonify({'error':
                    f'Dimension mismatch — A is {A.shape[0]}x{A.shape[1]}, '
                    f'B is {B.shape[0]}x{B.shape[1]}. Both must be same size.'}), 400
            R = (A + B).tolist()
            return jsonify({'success': True, 'result': {
                'type': 'matrix', 'data': R,
                'label': 'A + B', 'shape': f'{len(R)}x{len(R[0])}'
            }})

        elif operation == 'subtract':
            if B is None:
                return jsonify({'error': 'Matrix B is required for subtraction'}), 400
            if A.shape != B.shape:
                return jsonify({'error':
                    f'Dimension mismatch — A is {A.shape[0]}x{A.shape[1]}, '
                    f'B is {B.shape[0]}x{B.shape[1]}. Both must be same size.'}), 400
            R = (A - B).tolist()
            return jsonify({'success': True, 'result': {
                'type': 'matrix', 'data': R,
                'label': 'A - B', 'shape': f'{len(R)}x{len(R[0])}'
            }})

        elif operation == 'multiply':
            if B is None:
                return jsonify({'error': 'Matrix B is required for multiplication'}), 400
            if A.shape[1] != B.shape[0]:
                return jsonify({'error':
                    f'Cannot multiply — cols(A)={A.shape[1]} must equal rows(B)={B.shape[0]}'}), 400
            R = np.dot(A, B).tolist()
            return jsonify({'success': True, 'result': {
                'type': 'matrix', 'data': R,
                'label': 'A x B', 'shape': f'{len(R)}x{len(R[0])}'
            }})

        elif operation == 'transpose':
            Ra = A.T.tolist()
            Rb = B.T.tolist() if B is not None else None
            return jsonify({'success': True, 'result': {
                'type': 'transpose',
                'data_a': Ra, 'data_b': Rb,
                'shape_a': f'{len(Ra)}x{len(Ra[0])}',
                'shape_b': f'{len(Rb)}x{len(Rb[0])}' if Rb else None,
                'label': 'Transpose'
            }})

        elif operation == 'determinant':
            det_a = det_b = err_a = err_b = None
            if A.shape[0] == A.shape[1]:
                raw = float(np.linalg.det(A))
                det_a = 0.0 if abs(raw) < 1e-10 else round(raw, 4)
            else:
                err_a = f'A is {A.shape[0]}x{A.shape[1]} — not a square matrix'
            if B is not None:
                if B.shape[0] == B.shape[1]:
                    raw = float(np.linalg.det(B))
                    det_b = 0.0 if abs(raw) < 1e-10 else round(raw, 4)
                else:
                    err_b = f'B is {B.shape[0]}x{B.shape[1]} — not a square matrix'
            return jsonify({'success': True, 'result': {
                'type': 'determinant',
                'det_a': det_a, 'det_b': det_b,
                'err_a': err_a, 'err_b': err_b,
                'label': 'Determinant'
            }})

        elif operation == 'inverse':
            inv_a = inv_b = err_a = err_b = None
            if A.shape[0] == A.shape[1]:
                try:
                    raw_det = np.linalg.det(A)
                    if abs(raw_det) < 1e-9:
                        err_a = "Matrix A is singular (det=0)"
                    else:
                        inv_a = np.linalg.inv(A).tolist()
                except Exception as e:
                    err_a = f"Inversion failed: {str(e)}"
            else:
                err_a = f"A is {A.shape[0]}x{A.shape[1]} — not a square matrix"

            if B is not None:
                if B.shape[0] == B.shape[1]:
                    try:
                        raw_det = np.linalg.det(B)
                        if abs(raw_det) < 1e-9:
                            err_b = "Matrix B is singular (det=0)"
                        else:
                            inv_b = np.linalg.inv(B).tolist()
                    except Exception as e:
                        err_b = f"Inversion failed: {str(e)}"
                else:
                    err_b = f"B is {B.shape[0]}x{B.shape[1]} — not a square matrix"

            return jsonify({'success': True, 'result': {
                'type': 'inverse',
                'data_a': inv_a, 'data_b': inv_b,
                'err_a': err_a, 'err_b': err_b,
                'label': 'Inverse'
            }})

        elif operation == 'rank_trace':
            rank_a = int(np.linalg.matrix_rank(A))
            trace_a = err_trace_a = None
            if A.shape[0] == A.shape[1]:
                trace_a = float(np.trace(A))
            else:
                err_trace_a = "A is not square"

            rank_b = trace_b = err_trace_b = None
            if B is not None:
                rank_b = int(np.linalg.matrix_rank(B))
                if B.shape[0] == B.shape[1]:
                    trace_b = float(np.trace(B))
                else:
                    err_trace_b = "B is not square"

            return jsonify({'success': True, 'result': {
                'type': 'rank_trace',
                'rank_a': rank_a, 'trace_a': trace_a, 'err_trace_a': err_trace_a,
                'rank_b': rank_b, 'trace_b': trace_b, 'err_trace_b': err_trace_b,
                'label': 'Rank & Trace'
            }})

        else:
            return jsonify({'error': f'Unknown operation: {operation}'}), 400

    except ValueError as e:
        return jsonify({'error': f'Invalid value: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
