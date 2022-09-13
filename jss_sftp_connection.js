require(['N/sftp', 'N/file'],
    function(sftp, file) {
        var mypass = "password";
        var myHostKey = "2hy+e86vPQyfB/FH1D1eFJl1xoSw+MChQqzyTVQnW+uJHM0xCc/po2X2rr0q2K4DpK8KyzPyyPV0hfi4f+cdEkMaFCMFbVKxCq2VdR7YbS7Ta45MhUEGaEJWVd6vMTrYjQDqbS0Ie0wE+dT6wUpeY+6BBNMtSZed2KkqS41WKAXgYwfjVHrBUqF5hf1uu4e8/6k7jrMpOFRMobEFRBPw+pDa8DWQ714yO46AYES1R9d39pNJ1jfLYnw92Z5Tq6x6kdunvKtIgEkE95V9VL+0n4yVCfAZ+kR7tW/GHjycZ3hJEfxAkrv62Ol6W7vWStGSe09W3xr7o2ksU1r+AltLj5Mqnp1QyxS/C8B8KKibDRpDS+bu20RpacFdDW9dnlomj5Um3doS5uruY+ja40he4XgU1UB9RH2N5LJ7eCJKunPd7Y/Ei3jPk50pZRm9d7acNfOcR7LCb+ZUG6dKKgdD2h7lCBGs890FjbwGC4Gpgp3aE1kQ4Yhu0b5EotZx9djry6sNcWmdMbV/mt/j1cSkO6VOWogmA06JR8B046QAjPaImuRdny93TOoiS6SYEREesaDt2WoxoRuaTPo+oLxagqLgdfQMExEhFyqfI9PAD6A8y86P8esrI4+8/3kT98HDyPy+DJ8MjpCcSBvR/mzI6sYUOQM5udHZ0OaN1k34JW/sY3/0IKkbTgiHHQ2RraEzezcn+T42MGgbIC1T9vnLQTAGnN+aMTwkwMd3IVz1qyUc5MJwI11n/4Fd5rd5w2BS8WNT31O5HGD4ZEOQI9Hm8fktWgmD93syWmwg0JKGzbQhxu+GT4GrmwP6blyM671pJt7Q+a8mBIsUR7omhMbRmkFmkwO0VsQLeUUPx7xx+oz/JZBF0+OTcpBNtMHDRL9TPrivate-MAC: e9233114c6c653ded981610ecf7665a29912f15d";
        var userName = 'tester';
        var serverUrl = 'sftp://192.168.137.1:22';

        // establish connection to remote FTP server

        var connection = sftp.createConnection({
            username: userName,
            passwordGuid: mypass, // references var myPwdGuid
            url: serverUrl,
            directory: './',
            hostKey: myHostKey // references var myHostKey
        });
        log.debug({
            title: "connection is ",
            details: {"connection": connection}
        })
        var x = 0;

});