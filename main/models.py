from mongoengine import *


class User(Document):
    name    = StringField(max_length = 100, required=True)
    email   = StringField(required=True)
    pwd     = StringField(required=True)
    prefs   = ListField(StringField(max_length=30))

    def __unicode__(self):
        return self.name
