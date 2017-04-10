/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
        if (cordova.platformId === 'ios') {
            var ws = new Websock();
            ws.open('ws://localhost:39741');
            ws.on('open', function() {
                console.log = function(a) {
                   ws.send_string(a+'\n');
                    if (a.indexOf('1..') === 0) {
                        // this hack appends DONE line after all tests are executed:
                        // (FIXME implement in a cleaner way)
                        setTimeout(function() { ws.send_string('DONE\n'); });
                    }
                };
                require('./test_hash');
                require('./test_base58');
                require('./test_aes');
                require('./test_scrypt');
                require('./test_bip38');
                require('./test_bip32');
            });
        } else {
            window.resolveLocalFileSystemURL(cordova.file.applicationStorageDirectory, function (dirEntry) {
                dirEntry.getFile('console.log.txt', {create: true, exclusive: false}, function(fileEntry) {
                    var q = [];
                    var bytes = 0;
                    var oldlog = console.log.bind(console);
                    var flush = function () {
                        if (q.length === 0) return;
                        var dataObj = new Blob([q[0]], { type: 'text/plain' });
                        fileEntry.createWriter(function (fileWriter) {
                            fileWriter.seek(fileWriter.length);
                            fileWriter.write(dataObj);
                            fileWriter.onwriteend = function () {
                                oldlog(q[0]);
                                q.shift();
                                flush();
                            }
                            fileWriter.onerror = console.error;
                        }, console.error);
                     };
                     console.log = function(a) {
                         q.push(a+'\n');
                         if (q.length === 1) flush();
                         if (a.indexOf('1..') === 0) {
                             // this hack appends DONE line after all tests are executed:
                             // (FIXME implement in a cleaner way)
                             setTimeout(function() { console.log('DONE\n'); });
                         }
                     };
                     require('./test_hash');
                     require('./test_base58');
                     require('./test_aes');
                     require('./test_scrypt');
                     require('./test_bip38');
                     require('./test_bip32');
                 }, console.error);
             }, console.error);
         }
    }
};

app.initialize();
