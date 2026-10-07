import sys
sys.path.insert(0,'.')
from build import parse
def keys(p):
    return {(e['fields'].get('msgctxt','')+'\x04' if 'msgctxt' in e['fields'] else '')+e['fields']['msgid']:e for e in parse(p)[1:]}
old=keys(sys.argv[1]); new=keys(sys.argv[2])
for k,e in new.items():
    if k not in old:
        refs=[c for c in e['comments'] if c.startswith('#:')]
        cm=[c for c in e['comments'] if c.startswith('#.')]
        print(repr(k), '||PL:'+e['fields']['msgid_plural'] if 'msgid_plural' in e['fields'] else '', refs[0][3:] if refs else '', ' '.join(cm))
print('---removed')
for k in old:
    if k not in new: print(repr(k))
