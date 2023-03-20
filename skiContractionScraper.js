var contractions = contractions || {};
function nextLayer(cursor) {
    console.log(cursor);
    fetch("https://www.khanacademy.org/api/internal/graphql/feedbackForAuthor?/math/", {
      "body": `{\"operationName\":\"feedbackForAuthor\",\"variables\":{\"feedbackType\":\"REPLY\",\"kaid\":\"kaid_1037904081391187080498507\",\"cursor\":\"${cursor}\",\"limit\":10,\"sort\":3},\"query\":\"query feedbackForAuthor($kaid: String!, $feedbackType: FeedbackType!, $cursor: String, $limit: Int, $sort: Int) {\\n  feedbackForAuthor(kaid: $kaid, feedbackType: $feedbackType, cursor: $cursor, limit: $limit, sort: $sort) {\\n    feedback {\\n      replyCount\\n      appearsAsDeleted\\n      author {\\n        id\\n        kaid\\n        nickname\\n        avatar {\\n          name\\n          imageSrc\\n          __typename\\n        }\\n        __typename\\n      }\\n      content\\n      date\\n      definitelyNotSpam\\n      deleted\\n      downVoted\\n      expandKey\\n      feedbackType\\n      flaggedBy\\n      flags\\n      focusUrl\\n      focus {\\n        kind\\n        id\\n        translatedTitle\\n        __typename\\n      }\\n      fromVideoAuthor\\n      key\\n      lowQualityScore\\n      notifyOnAnswer\\n      permalink\\n      qualityKind\\n      replyCount\\n      replyExpandKeys\\n      showLowQualityNotice\\n      sumVotesIncremented\\n      upVoted\\n      ... on QuestionFeedback {\\n        hasAnswered\\n        isOld\\n        __typename\\n      }\\n      ... on AnswerFeedback {\\n        question {\\n          content\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    isMod\\n    isComplete\\n    cursor\\n    __typename\\n  }\\n}\\n\"}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "omit"
    }).then(re=>re.json()).then(re => {
        //console.log(re);
        var comments = re.data.feedbackForAuthor.feedback;
        for (var i = comments.length; i--;) {
            var comment = comments[i].content;
            comment = comment.match(/[\w'\s]+/g)
            if (comment) {
                comment = comment.join("");
                var words = comment.split(/( |\n)/);
                for (var j = words.length; j--;) {
                    if (
                        words[j].includes("'") && 
                        !words[j].endsWith("'s")
                    ) {
                        contractions[words[j]] = true;
                    }
                }
            } else console.log("Ignoring: " + comments[i].content)
            
        }
        console.log("Current contractinos: " + JSON.stringify(Object.keys(contractions)));
        
        var cursor = re.data.feedbackForAuthor.cursor;
        if (cursor) nextLayer(cursor);
        else { console.log("No key found. Either you reached the end, or there was a bug."); console.log(re); }
    });
}
nextLayer("");
