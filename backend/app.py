from flask import Flask, jsonify, request, session
from flask_mysqldb import MySQL
from flask_cors import CORS
import mysql.connector
from werkzeug.utils import secure_filename
import os
import pymysql
import ssl


app = Flask(__name__)
CORS(app, supports_credentials=True)
CORS(app, origins='http://localhost:3000')



db =mysql.connector.connect(
    host="localhost",
    user="root",
    password="Pr1jw@l1",
    database="job_portal",
)

@app.route('/getjobs', methods=['GET'])
def get_jobs():
    user_id = request.headers.get('Authorization').split(' ')[1] if 'Authorization' in request.headers else None
    if user_id:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM jobs WHERE user_id = %s", (user_id,))
        jobsp = cursor.fetchall()
        cursor.close()
        return jsonify(jobsp)
    else:
        return jsonify([])


@app.route('/loginseek', methods=['POST'])
def loginseek():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    cursor = db.cursor()
    sql = "SELECT * FROM users WHERE username = %s AND password = %s"
    cursor.execute(sql, (username, password))
    user = cursor.fetchone()
    cursor.close()
    
    if user:
        return jsonify({'success': True, 'message': 'Login successful','userId':user[0]})
    else:
        return jsonify({'success': False, 'message': 'Invalid username or password'})

@app.route('/checkseek', methods=['GET'])
def checkseek():
    
    if 'user_id' in session and session['role'] == 'seeker' :
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
    
@app.route('/checkhire', methods=['GET'])
def checkhire():
    
    if 'user_id' in session and session['role'] == 'provider':
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
    
@app.route('/loginhire', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    cursor = db.cursor()
    sql = "SELECT * FROM hire_users WHERE username = %s AND password = %s"
    cursor.execute(sql, (username, password))
    user = cursor.fetchone()
    cursor.close()
    
    if user:
        return jsonify({'success': True, 'message': 'Login successful','userId':user[0]})
    else:
        return jsonify({'success': False, 'message': 'Invalid username or password'})

UPLOAD_FOLDER = 'uploads'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
@app.route('/register', methods=['POST'])
def register():
    
    job_id = request.form['jobId']
    name = str(request.form['name'])
    college = request.form['college']
    skillset = request.form['skillset']
    resume = request.files['resume']
    
    if resume and allowed_file(resume.filename):
        filename = secure_filename(resume.filename)
        resume.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    else:
        return jsonify({'message': 'Invalid file type'}), 400
    user_id = request.headers.get('Authorization').split(' ')[1] if 'Authorization' in request.headers else None
    if user_id:
        cursor = db.cursor()
        cursor.execute("INSERT INTO registered_users (name, college, skillset, resume_filename, job_id) VALUES (%s, %s, %s, %s, %s)",
                       (name, college, skillset, filename, job_id))
        cursor.close()
        db.commit()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM usercourses WHERE course_id=%s and user_id=%s",(job_id, user_id))
        already=cursor.fetchone()
        if already:
            return jsonify({'message': 'User registered already'})
        else:
            cursor = db.cursor()
            cursor.execute("INSERT INTO usercourses(user_id, course_id) VALUES (%s, %s)",
                       (user_id, job_id))
            db.commit()
            cursor.close()
            return jsonify({'message': 'User registered successfully'})

        
@app.route('/registered', methods=['GET'])
def get_user_registered_jobs():
    user_id = request.headers.get('Authorization').split(' ')[1] if 'Authorization' in request.headers else None
    
    if user_id:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM jobs join usercourses on jobs.id = usercourses.course_id WHERE usercourses.user_id = %s", (user_id,))
        jobsp = cursor.fetchall()
        cursor.close()
        return jsonify(jobsp)
    else:
        return jsonify([])


@app.route('/debug_session')
def debug_session():
    # Print session data for debugging
    return str(session)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    cursor = db.cursor()
    try:

        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({'message': 'Username already exists'})


        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
        db.commit()

        return jsonify({'message': 'User registered successfully'})
    except Exception as e:
        db.rollback()
        return jsonify({'message': 'Failed to register user'}), 500
    finally:
        cursor.close()
    
@app.route('/signuphire', methods=['POST'])
def signuphire():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM hire_users WHERE username = %s", (username,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({'message': 'Username already exists'})

        cursor.execute("INSERT INTO hire_users (username, password) VALUES (%s, %s)", (username, password))
        db.commit()

        return jsonify({'message': 'User registered successfully'})
    except Exception as e:
        db.rollback()
        return jsonify({'message': 'Failed to register user'}), 500
    finally:
        cursor.close()

@app.route('/search', methods=['POST'])
def search():
    cursor=db.cursor()
    query = request.json['query']
    results = []
    sql = "SELECT * FROM your_table WHERE column_name LIKE %s"
    cursor.execute(sql, ('%' + query + '%',))
    results = cursor.fetchall()
    return jsonify(results)


@app.route('/regdet', methods=['GET'])
def regdet():
    jobid = request.headers.get('Authorization').split(' ')[1] if 'Authorization' in request.headers else None
    jobid
    if jobid:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM registered_users where job_id=%s",(jobid,))
        jobsp = cursor.fetchall()
        cursor.close()
        return jsonify(jobsp)

@app.route('/addedjobs', methods=['GET'])
def addedjobs():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM jobs")
    jobsp = cursor.fetchall()
    cursor.close()
    return jsonify(jobsp)
    
@app.route('/addjobs', methods=['POST'])
def addjob():
    user_id = request.headers.get('Authorization').split(' ')[1] if 'Authorization' in request.headers else None
    if user_id:
        data = request.json
        title = data['title']
        description = data['description']
        location = data['location']
        requirements = data['requirements']
        salary = data['salary']
        deletion_date = data['deletion_date']  # Assuming deletion_date is provided in the request JSON
        
        cursor = db.cursor()
        cursor.execute("INSERT INTO jobs (title, description, location, requirements, salary, deletion_date, user_id) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                    (title, description, location, requirements, salary, deletion_date, user_id))
        db.commit()
        cursor.close()
        cursor = db.cursor()
        cursor.execute(f"CREATE EVENT delete_job_{cursor.lastrowid} "
                       f"ON SCHEDULE AT '{deletion_date} 00:00:00' "
                       f"DO "
                       f"BEGIN "
                       f"DELETE FROM jobs WHERE id = {cursor.lastrowid}; "
                       f"END;")
        db.commit()
        cursor.close()
        
        return jsonify({"message": "Job added successfully"})
    else:
        return jsonify({"error": "User not authenticated"})


@app.route('/deletejob/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    try:
        cursor=db.cursor()
        sql = "DELETE FROM jobs WHERE id = %s"
        cursor.execute(sql, (job_id,))
        db.commit() 
        cursor.close()
        return jsonify({'message': 'Job deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    
    app.run(debug=True)
