from mongoengine import *
import json


class User(Document):
    name    = StringField(max_length = 100, required=True)
    email   = StringField(required=True)
    pwd     = StringField(required=True)
    prefs   = ListField(StringField(max_length=30))

    def __unicode__(self):
        return self.name

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)
