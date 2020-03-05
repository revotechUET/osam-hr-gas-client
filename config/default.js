const spreadsheetId = '1uEYFEuYKH8gYHicVcTCDiICCQwyw0cvQ5ND64GMds8A';
export default {
  spreadsheet: {
    spreadsheetId,
    sheetSpecs: {
      user: ['id', 'email', 'role', 'name', 'active', 'idContract'],
      department: ['id', 'name', 'active', 'idManager', 'idApprovers', 'idGroup'],
      user_department: ['id', 'idUser', 'idDepartment'],
      contract: [
        ['id', 'name', 'type', 'lunch', 'leaveRequest'],
        ['aaaaaaaa', 'Chính thức', 'fulltime', true, true],
      ],
      checking: ['id', 'date', 'checkinTime', 'checkoutTime', 'reportContent', 'responseContent', 'reportStatus', 'idUser', 'note'],
      leave: ['id', 'startTime', 'endTime', 'reason', 'description', 'status', 'idRequester', 'idApprover', 'deletedReason', 'eventId'],
      notification: ['id', 'title', 'content', 'type', 'date', 'receipient', 'status', 'sendDate'],
      setting: [
        ['id', 'welcomeMessage', 'monthEnd', 'yearEnd', 'morningStart', 'morningEnd', 'afternoonStart', 'afternoonEnd', 'lunchStart', 'lunchEnd', 'workDays'],
        ['0', 'Chúc bạn ngày mới vui vẻ', '1', '0', '1999-01-01T02:00:00.000Z', '1999-01-01T05:00:00.000Z', '1999-01-01T06:00:00.000Z', '1999-01-01T11:00:00.000Z', '1999-01-01T04:30:00.000Z', '1999-01-01T07:30:00.000Z', '[0, 3, 3, 3, 3, 3, 1]']
      ],
    }
  },
  serviceAccount: {
    "type": "service_account",
    "project_id": "osam-hr",
    "private_key_id": "99c4cb378cc9b2e3c2397c96b4dd005c339eb55e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDT6xNFAq93bZck\n5Nw7aKsk3IsD4DdIggeYs1oCvrm+16QmhjWzzQ7++sTTYtL+XIf0EChDr60MLoxJ\nWP87523kFFPZ7iwwW7mI6WxlrSBv4KFHEFKtceCl5MjZBOsr9zvrD1nuXe1UCIRX\n6BP/pVx7S22SoohwCqq3schtk3z4LcjcR41xHdnF2/LGJrG62OnPSjSAmpJchUzU\ntMN0h+YH9kALMLDTyfbYC4Brn7Figvnd+/vtMLEUs4RymlUKArhqA4/4AT8I3idN\nf14WUc4mmQoQ5Q33Sbkrh6bLdwvQHfIrPzH4mW9HiXxx0WB2jqq9G1oksh1PCqiQ\n70V74EW5AgMBAAECggEAFK76e/9Vme331RGDT0cZgSkHZnLxYmHSlPxYWjE8Vtyc\nOGhcAHcQsiFOqaUZG9tzJ4aWL3kLhkdayOPnUXT2nE7BmmEtLfEd7DeALXJW2qSN\niS6WKziUqQxp8AiTXYCtd/VRHTtMqSmFpUDRBuAgZSZJBQlZELpxzCkNe2hsR5qe\n5i2sRM5FRmwDdqsNlk1lqvvtJ4l/+uw/+XUTLd5XsWhTxCSQrTjcX3lLXKSLK+sB\nojOrkZbpb3jqWxjGSDB/k+Csse4+5c5xv2raYTfsD7bt3TGxltPIK6rX/GDbyR7i\nATt3jzUReO3/CGuY+sHP8PcE1VQaqTg/IuQy7bM74wKBgQDvx46TqZwKVtvX7Hi5\npKT90FybvvdTer9yb7JZePOv4QUNPxqr7tyk/CyaJcpKHHSBOeEvoOUCgsci+20X\nUXZNaJFsk0pMsTbdSbDXWk3aGxxTmjOqtYnFo2GFhnlIis8RGwsLTvoRmCs9dZCA\ne8A4mla4W+W3VEM0Q4nf8F8t2wKBgQDiQQYeuGrQgai4v9hDEtJUZcz0DDt32y4Y\nHrqhGFqT2nWk1z0l0h2Al053kyPA8bkpnAcyTa1atXLhkzoSrcV6f8PMzUYxHVkQ\nbcz5O/QNrGVBvCDq2aNV8ptJs+XsVYKfV750emlehowNdizEly4mdp2UJJxz2q9t\nSwBZPgPw+wKBgBdU2qnBoj5bT08GYoTl4WwVHz3EajqEQia3eao9G7Esexpb3pOG\nTY/8PbbOII3vkOKWKDRDOqVw5kGgJ3BSa+mCWEwxVNR7lfQYXI3H6rVjV/FGmups\nebhyemXMvPZzE0z9zahPCgQ2Q1banrHx2LVpRzDvOD4Lg/KM89iHgitrAoGAdrGg\nEUu0FZB/v/Q88usT1lzViY5FQFqGsvaj99E762bm4sRb+tRgz84QxyA02Iq3FcIZ\n8GTZtcWM8BP5mkT5XYtbX7ysvyVjTQAdUP8HyIiRUkvshOgKDRPKLX8n9rThYtB4\nRMjXMFSrcoB1eejJuDnv7wDJ5ulpsI9xLmAfVzMCgYA/f9a4JU3BGSdluF8iTEYw\nUCjYsHY/YdvhKW0T70NTA6pwDUxQkwGATRs+RD2Qj5vQkNVrREvHHSM7qw4KK5Ou\nf79p8uJntpusgEp0SSlH+9ihome111+JEWxwLsxPn1mSbrkGKqZKS7GwM5MkZkwY\nniEMMFD9jsw44StcGXK4NA==\n-----END PRIVATE KEY-----\n",
    "client_email": "test-607@osam-hr.iam.gserviceaccount.com",
    "client_id": "110757234229754123641",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/test-607%40osam-hr.iam.gserviceaccount.com",
    "scopes": [
      "https://www.googleapis.com/auth/spreadsheets",
    ]
  },
  calendarIds: [
    "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com",
    "rvtcompany.page_fqbe7o1ko3qu7m1fs1njfefi2o@group.calendar.google.com"
  ], // [leave request, day-off]

}
