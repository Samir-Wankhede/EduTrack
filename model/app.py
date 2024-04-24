from flask import Flask, request, jsonify
import pandas as pd
from math import ceil

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # Get input data from JSON request
    data = request.get_json()

    # Perform your ML model prediction here
    prediction = predict_function(int(data['student_id']),data['sub'],data['sem'])

    # Prepare the response
    response = {
        "note": prediction[0],
        "max_att": prediction[1],
        "current_att": prediction[2]
    }

    return jsonify(response)




df1 = pd.read_csv('pbl_sem1_attendance.csv')
df2 = pd.read_csv('pbl_sem2_attendance.csv')

def getAttendance(S_ID, subject, sem):
    result = []
    
    if sem == "1":
        st = df1.loc[df1["reg_id"] == S_ID]
    elif sem == "2":
        st = df2.loc[df2["reg_id"] == S_ID]

    try:
        p_att = st[f"{subject} present"]
        present = int(p_att.iloc[0])

        a_att = st[f"{subject} absent"]
        absent = int(a_att.iloc[0])

        total_lec = st[f"{subject} total"]
        total = int(total_lec.iloc[0])

        curr_per = st[f"{subject} per"]
        per = int(curr_per.iloc[0])
    except KeyError:
        result.append("Subject invalid, try again")
        return result

    rem = total - (present + absent)
    minimum = ceil(0.75 * total)
    req = minimum - present
    max_att = round((((present + rem) / total) * 100), 4)

    if req <= 0:
        result.append("You've already achieved the minimum required attendance!")
    elif req > rem:
        result.append("You cannot achieve the minimum required attendance, consult your class-coordinator immediately!")
    else:
        result.append(f"You need to attend {req} more lectures to achieve minimum required attendance.")


    result.append(f"Maximum attendance achievable: {max_att}%")
    result.append(f"Current attendance: {per} ({present}/{total})")
    return result



def predict_function(student_id,sub,sem):


    res = getAttendance(student_id,sub,sem)
    return res
    

if __name__ == '__main__':
    app.run(debug=True)
